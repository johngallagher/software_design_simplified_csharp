using Castle;
using MicropostsApp.Extensions;
using Castle.Messages.Requests;
using MicropostsApp.Data;
using MicropostsApp.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace MicropostsApp.Controllers;

public class UsersController : Controller
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<User?> _userManager;
    private readonly CastleClient _castleClient;
    private readonly Cloudflare _cloudflare;

    public UsersController(
        ApplicationDbContext context,
        UserManager<User?> userManager,
        CastleClient castleClient,
        Cloudflare cloudflare
    )
    {
        _context = context;
        _userManager = userManager;
        _castleClient = castleClient;
        _cloudflare = cloudflare;
    }

    public IActionResult Create()
    {
        return View();
    }

    private const float HighRiskThreshold = 0.8f;
    private const float MediumRiskThreshold = 0.6f;

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(
        RegisterViewModel model
    )
    {
        if (!ModelState.IsValid)
            return View(
                model: model
            );

        await NotifyFraudDetectionSystemOf(
            type: "$registration",
            status: "$attempted",
            model: model
        );

        var user = new User { UserName = model.Email, Email = model.Email };
        var result = await _userManager.CreateAsync(
            user: user,
            password: model.Password
        );

        if (result.Succeeded)
        {
            var riskScore = await this.FetchRiskScore(
                type: "$registration",
                model: model,
                castleClient: _castleClient,
                user: user,
                status: "$succeeded"
            );

            if (riskScore >= HighRiskThreshold)
            {
                await BlockIpAddress();
                Response.StatusCode = 500;
                return View(
                    viewName: "Error500"
                );
            }

            if (riskScore >= MediumRiskThreshold && riskScore < HighRiskThreshold)
            {
                await ChallengeIpAddress();
            }

            var token = await _userManager.GenerateEmailConfirmationTokenAsync(
                user: user
            );
            await _userManager.ConfirmEmailAsync(
                user: user,
                token: token
            );
            return RedirectToAction(
                actionName: "Create",
                controllerName: "Sessions"
            );
        }

        await NotifyFraudDetectionSystemOf(
            type: "$registration",
            status: "$failed",
            model: model
        );

        foreach (var error in result.Errors)
            ModelState.AddModelError(
                key: string.Empty,
                errorMessage: error.Description
            );

        return View(
            model: model
        );
    }

    private async Task NotifyFraudDetectionSystemOf(
        string type,
        string status,
        RegisterViewModel model
    )
    {
        var user = await _userManager.FindByEmailAsync(
            email: model.Email
        );

        if (user != null)
            await _castleClient.Filter(
                request: new ActionRequest
                {
                    Type = type,
                    Status = status,
                    RequestToken = model.castle_request_token,
                    Context = Context.FromHttpRequest(
                        request: Request
                    ),
                    User = new Dictionary<string, object>
                    {
                        { "id", user.Id },
                        { "email", user.Email ?? string.Empty }
                    }
                }
            );
    }

    private async Task ChallengeIpAddress()
    {
        var ipAddress = GetIpAddress(
            context: Request.HttpContext
        );
        await _cloudflare.PreventIpAddress(
            ipAddress: ipAddress,
            mode: "challenge"
        );
    }

    private async Task BlockIpAddress()
    {
        var ipAddress = GetIpAddress(
            context: Request.HttpContext
        );
        await _cloudflare.PreventIpAddress(
            ipAddress: ipAddress,
            mode: "block"
        );
    }

    private string GetIpAddress(
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