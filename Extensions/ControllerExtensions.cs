using Castle;
using Castle.Messages.Requests;
using MicropostsApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace MicropostsApp.Extensions;

public static class ControllerExtensions
{
    public static async Task<RiskScore> FetchRiskScore(
        this Controller controller,
        CastleClient castleClient,
        User? user,
        string castleRequestToken,
        string type,
        string? name = null,
        string? status = null
    )
    {
        if (user == null) return new RiskScore { Score = 0 };
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
        return new RiskScore { Score = response.Risk };
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