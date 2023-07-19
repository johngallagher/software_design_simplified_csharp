using Castle;
using Castle.Infrastructure.Exceptions;
using Castle.Messages;
using Castle.Messages.Requests;
using MicropostsApp.Interfaces;
using MicropostsApp.Models;

namespace MicropostsApp.Services.Protectors;

public class CastleProtector
{
    private readonly Cloudflare _cloudflare;
    private readonly CastleClient _client;

    public CastleProtector(Cloudflare cloudflare, CastleClient client)
    {
        _cloudflare = cloudflare;
        _client = client;
    }

    public async Task<Protectable> Protect(
        Event @event,
        User? user,
        string token,
        HttpContext httpContext
    )
    {
        try
        {
            Protectable policy;
            if (user == null)
                policy = new Policy(action: ActionType.Allow);
            else
            {
                var response = await _client.Risk(
                    request: new ActionRequest
                    {
                        Type = ToType(@event: @event),
                        Status = ToStatus(@event: @event),
                        Name = ToName(@event: @event),
                        RequestToken = token,
                        Context = Context.FromHttpRequest(request: httpContext.Request),
                        User = new Dictionary<string, object>
                        {
                            { "id", user.Id },
                            { "email", user.Email ?? string.Empty }
                        }
                    }
                );
                policy = new Policy(action: response.Policy.Action);
            }

            if (policy.Deny())
            {
                await _cloudflare.Block(context: httpContext);
            }

            if (policy.Challenge())
            {
                await _cloudflare.Challenge(context: httpContext);
            }

            return policy;
        }
        catch (CastleInvalidTokenException)
        {
            return new Policy(action: ActionType.Deny);
        }
        catch (CastleExternalException)
        {
            return new Policy(action: ActionType.Allow);
        }
    }

    public async Task NotifyOf(
        Event @event,
        HttpRequest request,
        UserOperation operation
    )
    {
        try
        {
            await _client.Filter(
                request: new ActionRequest
                {
                    Type = ToType(@event: @event),
                    Status = ToStatus(@event: @event),
                    RequestToken = operation.CastleRequestToken,
                    Context = Context.FromHttpRequest(request: request),
                    User = new Dictionary<string, object>
                    {
                        { "email", operation.Email }
                    }
                }
            );
        }
        catch (Exception)
        {
            // ignored as there's nothing we can do to rescue
        }
    }

    private string? ToType(Event @event)
    {
        switch (@event)
        {
            case Event.LoginAttempted:
            case Event.LoginSucceeded:
            case Event.LoginFailed:
                return "$login";
            case Event.RegistrationAttempted:
            case Event.RegistrationSucceeded:
            case Event.RegistrationFailed:
                return "$registration";
            case Event.MicropostCreated:
                return "$custom";
            default:
                throw new ArgumentOutOfRangeException(
                    paramName: nameof(@event),
                    actualValue: @event,
                    message: "Invalid event name"
                );
        }
    }

    private string? ToStatus(Event @event)
    {
        switch (@event)
        {
            case Event.LoginAttempted:
            case Event.RegistrationAttempted:
                return "$attempted";
            case Event.LoginSucceeded:
            case Event.RegistrationSucceeded:
                return "$succeeded";
            case Event.LoginFailed:
            case Event.RegistrationFailed:
                return "$failed";
            case Event.MicropostCreated:
                return null;
            default:
                throw new ArgumentOutOfRangeException(
                    paramName: nameof(@event),
                    actualValue: @event,
                    message: "Invalid event name"
                );
        }
    }

    private string? ToName(Event @event)
    {
        return @event == Event.MicropostCreated ? "Created a micropost" : null;
    }
}
