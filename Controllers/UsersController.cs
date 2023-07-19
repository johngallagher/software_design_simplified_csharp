using Castle;
using MicropostsApp.Data;
using MicropostsApp.Extensions;
using MicropostsApp.Models;
using MicropostsApp.Services;
using MicropostsApp.Services.Protectors;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace MicropostsApp.Controllers;

public class UsersController : Controller
{
    private readonly CastleClient _castleClient;
    private readonly Cloudflare _cloudflare;
    private readonly CastleProtector _castleProtector;
    private readonly UserManager<User> _userManager;

    public UsersController(
        UserManager<User> userManager,
        CastleClient castleClient,
        Cloudflare cloudflare,
        CastleProtector castleProtector
    )
    {
        _userManager = userManager;
        _castleClient = castleClient;
        _cloudflare = cloudflare;
        _castleProtector = castleProtector;
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
            return View(model: model);

        var user = new User { UserName = model.Email, Email = model.Email };
        await _castleProtector.NotifyFraudDetectionSystemOf(
            controller: this,
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
            var policy = await _castleProtector.ProtectFromBadActors(
                controller: this,
                type: "$registration",
                status: "$succeeded",
                castleClient: _castleClient,
                user: user,
                castleRequestToken: model.CastleRequestToken
            );

            if (policy.Deny())
            {
                Response.StatusCode = 500;
                return View(viewName: "Error500");
            }

            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user: user);
            await _userManager.ConfirmEmailAsync(user: user, token: token);
            return RedirectToAction(actionName: "Create", controllerName: "Sessions");
        }

        await _castleProtector.NotifyFraudDetectionSystemOf(
            controller: this,
            type: "$registration",
            status: "$failed",
            userEmail: model.Email,
            castleClient: _castleClient,
            castleRequestToken: model.CastleRequestToken
        );

        foreach (var error in result.Errors)
            ModelState.AddModelError(key: string.Empty, errorMessage: error.Description);

        return View(
            model: model
        );
    }
}