using Castle;
using MicropostsApp.Extensions;
using MicropostsApp.Models;
using MicropostsApp.Services;
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
            var policy = await this.ProtectFromBadActors(
                type: "$login",
                status: "$succeeded",
                castleClient: _castleClient,
                cloudflare: _cloudflare,
                user: await _userManager.FindByEmailAsync(email: model.Email),
                castleRequestToken: model.CastleRequestToken
            );

            if (policy.Deny())
            {
                Response.StatusCode = 500;
                return View(viewName: "Error500");
            }

            return RedirectToAction(actionName: "Index", controllerName: "Home");
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