using Castle;
using Castle.Infrastructure.Exceptions;
using Castle.Messages;
using Castle.Messages.Requests;
using MicropostsApp.Interfaces;
using MicropostsApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace MicropostsApp.Services.Protectors;

public class CastleProtector
{
    private readonly Cloudflare _cloudflare;

    public CastleProtector(Cloudflare cloudflare)
    {
        _cloudflare = cloudflare;
    }

    public async Task<IProtectable> ProtectFromBadActors(
        Controller controller,
        CastleClient castleClient,
        User? user,
        string castleRequestToken,
        string type,
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
                var response = await castleClient.Risk(
                    request: new ActionRequest
                    {
                        Type = type,
                        Status = status,
                        Name = name,
                        RequestToken = castleRequestToken,
                        Context = Context.FromHttpRequest(
                            request: controller.Request
                        ),
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
                await _cloudflare.Block(context: controller.HttpContext);
            }

            if (policy.Challenge())
            {
                await _cloudflare.Challenge(context: controller.HttpContext);
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

    public async Task NotifyFraudDetectionSystemOf(
        Controller controller,
        string type,
        string status,
        string userEmail,
        CastleClient castleClient,
        string castleRequestToken
    )
    {
        try
        {
            await castleClient.Filter(
                request: new ActionRequest
                {
                    Type = type,
                    Status = status,
                    RequestToken = castleRequestToken,
                    Context = Context.FromHttpRequest(
                        request: controller.Request
                    ),
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