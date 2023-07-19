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
        RegisterViewModel registration
    )
    {
        if (!ModelState.IsValid)
            return View(model: registration);

        var user = new User { UserName = registration.Email, Email = registration.Email };
        await _protector.NotifyOf(
            type: "$registration",
            status: "$attempted",
            userEmail: registration.Email,
            castleRequestToken: registration.CastleRequestToken,
            request: Request,
            registration: registration
        );
        var result = await _userManager.CreateAsync(
            user: user,
            password: registration.Password
        );
        if (result.Succeeded)
        {
            var policy = await _protector.Protect(
                user: user,
                castleRequestToken: registration.CastleRequestToken,
                httpContext: HttpContext,
                type: "$registration",
                status: "$succeeded"
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

        await _protector.NotifyOf(
            type: "$registration",
            status: "$failed",
            userEmail: registration.Email,
            castleRequestToken: registration.CastleRequestToken,
            request: Request,
            registration: registration
        );

        foreach (var error in result.Errors)
            ModelState.AddModelError(key: string.Empty, errorMessage: error.Description);

        return View(
            model: registration
        );
    }
}