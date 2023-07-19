using Castle;
using Castle.Messages;
using Castle.Messages.Requests;
using MicropostsApp.Interfaces;
using MicropostsApp.Models;
using MicropostsApp.Services;
using Microsoft.AspNetCore.Mvc;

namespace MicropostsApp.Extensions;

public static class ControllerExtensions
{
    public static async Task<IProtectable> ProtectFromBadActors(
        this Controller controller,
        CastleClient castleClient,
        User? user,
        string castleRequestToken,
        string type,
        Cloudflare cloudflare,
        string? name = null,
        string? status = null
    )
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
            await cloudflare.Block(context: controller.HttpContext);
        }

        if (policy.Challenge())
        {
            await cloudflare.Challenge(context: controller.HttpContext);
        }

        return policy;
    }

    public static async Task NotifyFraudDetectionSystemOf(
        this Controller controller,
        string type,
        string status,
        string userEmail,
        CastleClient castleClient,
        string castleRequestToken
    )
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
}