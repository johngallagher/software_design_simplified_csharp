using Castle;
using Castle.Messages.Requests;
using MicropostsApp.Extensions;
using MicropostsApp.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace MicropostsApp.Controllers;

public class SessionsController : Controller
{
    private readonly CastleClient _castleClient;
    private readonly Cloudflare _cloudflare;
    private readonly SignInManager<User> _signInManager;
    private readonly UserManager<User> _userManager;

    public SessionsController(
        UserManager<User> userManager,
        SignInManager<User> signInManager,
        CastleClient castleClient,
        Cloudflare cloudflare
    )
    {
        _userManager = userManager;
        _signInManager = signInManager;
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
    public async Task<IActionResult> Create(
        LoginViewModel model
    )
    {
        if (!ModelState.IsValid)
            return View(
                model: model
            );

        await NotifyFraudDetectionSystemOf(
            type: "$login",
            status: "$attempted",
            model: model
        );

        var result = await _signInManager.PasswordSignInAsync(
            userName: model.Email,
            password: model.Password,
            isPersistent: false,
            lockoutOnFailure: false
        );
        if (result.Succeeded)
        {
            var riskScore = await this.FetchRiskScore(
                type: "$login",
                model: model,
                castleClient: _castleClient,
                user: await _userManager.FindByEmailAsync(
                    email: model.Email
                ),
                status: "$succeeded"
            );

            if (riskScore >= HighRiskThreshold)
            {
                await this.BlockIpAddress(
                    cloudflare: _cloudflare
                );
                Response.StatusCode = 500;
                return View(
                    viewName: "Error500"
                );
            }

            if (riskScore >= MediumRiskThreshold && riskScore < HighRiskThreshold)
            {
                await this.ChallengeIpAddress(
                    cloudflare: _cloudflare
                );
            }

            return RedirectToAction(
                actionName: "Index",
                controllerName: "Home"
            );
        }

        await NotifyFraudDetectionSystemOf(
            type: "$login",
            status: "$failed",
            model: model
        );

        ModelState.AddModelError(
            key: string.Empty,
            errorMessage: result.ToString()
        );
        return View(
            model: model
        );
    }

    private async Task NotifyFraudDetectionSystemOf(
        string type,
        string status,
        LoginViewModel model
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
}