using Castle;
using Castle.Messages.Requests;
using MicropostsApp.Interfaces;
using MicropostsApp.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace MicropostsApp.Extensions;

public static class ControllerExtensions
{
    public static async Task<float> FetchRiskScore(
        this Controller controller,
        string type,
        IProtectable model,
        CastleClient castleClient,
        User? user,
        string? name = null,
        string? status = null
    )
    {
        if (user == null) return 0;
        var response = await castleClient.Risk(
            request: new ActionRequest
            {
                Type = type,
                Status = status,
                Name = name,
                RequestToken = model.castle_request_token,
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
        return response.Risk;
    }

    public static async Task ChallengeIpAddress(this Controller controller, Cloudflare cloudflare)
    {
        var ipAddress = GetIpAddress(
            context: controller.Request.HttpContext
        );
        await cloudflare.PreventIpAddress(
            ipAddress: ipAddress,
            mode: "challenge"
        );
    }

    public static async Task BlockIpAddress(this Controller controller, Cloudflare cloudflare)
    
    {
        var ipAddress = GetIpAddress(
            context: controller.Request.HttpContext
        );
        await cloudflare.PreventIpAddress(
            ipAddress: ipAddress,
            mode: "block"
        );
    }

    private static string GetIpAddress(
        HttpContext context
    )
    {
        if (context.Request.Headers.TryGetValue(
                key: "X-Forwarded-For",
                value: out var forwardedFor
            ))
        {
            var ips = forwardedFor.ToString().Split(
                separator: ',',
                options: StringSplitOptions.TrimEntries
            );
            return ips[0];
        }

        return context.Connection.RemoteIpAddress?.ToString() ?? string.Empty;
    }
}



