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

    public async Task<IProtectable> Protect(
        User? user,
        string castleRequestToken,
        string type,
        HttpContext httpContext,
        string? name = null,
        string? status = null
    )
    {
        try
        {
            IProtectable policy;
            if (user == null)
                policy = new Policy(action: ActionType.Allow);
            else
            {
                var response = await _client.Risk(
                    request: new ActionRequest
                    {
                        Type = type,
                        Status = status,
                        Name = name,
                        RequestToken = castleRequestToken,
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
        string type,
        string status,
        string userEmail,
        string castleRequestToken,
        HttpRequest request
    )
    {
        try
        {
            await _client.Filter(
                request: new ActionRequest
                {
                    Type = type,
                    Status = status,
                    RequestToken = castleRequestToken,
                    Context = Context.FromHttpRequest(request: request),
                    User = new Dictionary<string, object>
                    {
                        { "email", userEmail }
                    }
                }
            );
        }
        catch (Exception)
        {
            // ignored as there's nothing we can do to rescue
        }
    }
}