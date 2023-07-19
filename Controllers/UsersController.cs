using MicropostsApp.Models;
using MicropostsApp.Services.Protectors;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace MicropostsApp.Controllers;

public class UsersController : Controller
{
    private readonly CastleProtector _protector;
    private readonly UserManager<User> _userManager;

    public UsersController(
        UserManager<User> userManager,
        CastleProtector protector
    )
    {
        _userManager = userManager;
        _protector = protector;
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
        await _protector.NotifyFraudDetectionSystemOf(
            controller: this,
            type: "$registration",
            status: "$attempted",
            userEmail: model.Email,
            castleRequestToken: model.CastleRequestToken
        );
        var result = await _userManager.CreateAsync(
            user: user,
            password: model.Password
        );
        if (result.Succeeded)
        {
            var policy = await _protector.ProtectFromBadActors(
                controller: this,
                type: "$registration",
                status: "$succeeded",
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

        await _protector.NotifyFraudDetectionSystemOf(
            controller: this,
            type: "$registration",
            status: "$failed",
            userEmail: model.Email,
            castleRequestToken: model.CastleRequestToken
        );

        foreach (var error in result.Errors)
            ModelState.AddModelError(key: string.Empty, errorMessage: error.Description);

        return View(
            model: model
        );
    }
}