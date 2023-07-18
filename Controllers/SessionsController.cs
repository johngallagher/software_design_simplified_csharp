using Castle;
using MicropostsApp.Extensions;
using MicropostsApp.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace MicropostsApp.Controllers;

public class SessionsController : Controller
{
    private const float HighRiskThreshold = 0.8f;
    private const float MediumRiskThreshold = 0.6f;
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

    [HttpPost]
    public async Task<IActionResult> Create(
        LoginViewModel model
    )
    {
        if (!ModelState.IsValid)
            return View(
                model: model
            );

        await this.NotifyFraudDetectionSystemOf(
            type: "$login",
            status: "$attempted",
            userEmail: model.Email,
            castleClient: _castleClient,
            castleRequestToken: model.CastleRequestToken
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
                status: "$succeeded",
                castleClient: _castleClient,
                user: await _userManager.FindByEmailAsync(
                    email: model.Email
                ),
                castleRequestToken: model.CastleRequestToken
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
                await this.ChallengeIpAddress(
                    cloudflare: _cloudflare
                );

            return RedirectToAction(
                actionName: "Index",
                controllerName: "Home"
            );
        }

        await this.NotifyFraudDetectionSystemOf(
            type: "$login",
            status: "$failed",
            userEmail: model.Email,
            castleClient: _castleClient,
            castleRequestToken: model.CastleRequestToken
        );

        ModelState.AddModelError(
            key: string.Empty,
            errorMessage: result.ToString()
        );
        return View(
            model: model
        );
    }
}