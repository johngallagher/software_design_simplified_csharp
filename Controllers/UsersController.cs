using Castle;
using MicropostsApp.Data;
using MicropostsApp.Extensions;
using MicropostsApp.Models;
using MicropostsApp.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace MicropostsApp.Controllers;

public class UsersController : Controller
{
    private readonly CastleClient _castleClient;
    private readonly Cloudflare _cloudflare;
    private readonly UserManager<User> _userManager;

    public UsersController(
        UserManager<User> userManager,
        CastleClient castleClient,
        Cloudflare cloudflare
    )
    {
        _userManager = userManager;
        _castleClient = castleClient;
        _cloudflare = cloudflare;
    }

    public IActionResult Create()
    {
        return View();
    }

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

        var user = new User { UserName = model.Email, Email = model.Email };
        await this.NotifyFraudDetectionSystemOf(
            type: "$registration",
            status: "$attempted",
            userEmail: model.Email,
            castleClient: _castleClient,
            castleRequestToken: model.CastleRequestToken
        );
        var result = await _userManager.CreateAsync(
            user: user,
            password: model.Password
        );
        if (result.Succeeded)
        {
            var riskScore = await this.FetchRiskScore(
                type: "$registration",
                status: "$succeeded",
                castleClient: _castleClient,
                user: user,
                castleRequestToken: model.CastleRequestToken
            );

            if (riskScore.Deny())
            {
                await _cloudflare.Block(
                    context: Request.HttpContext
                );
                Response.StatusCode = 500;
                return View(
                    viewName: "Error500"
                );
            }

            if (riskScore.Challenge())
                await _cloudflare.Challenge(
                    context: Request.HttpContext
                );

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

        await this.NotifyFraudDetectionSystemOf(
            type: "$registration",
            status: "$failed",
            userEmail: model.Email,
            castleClient: _castleClient,
            castleRequestToken: model.CastleRequestToken
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
}