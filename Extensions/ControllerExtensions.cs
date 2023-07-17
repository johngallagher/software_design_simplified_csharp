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
        string status,
        IProtectable model,
        CastleClient castleClient,
        User? user
    )
    {
        if (user == null) return 0;
        var response = await castleClient.Risk(
            request: new ActionRequest
            {
                Type = type,
                Status = status,
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
}



