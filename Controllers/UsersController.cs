using MicropostsApp.Interfaces;
using MicropostsApp.Models;
using MicropostsApp.Services.Protectors;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace MicropostsApp.Controllers;

public class UsersController : Controller
{
    private readonly Protector _protector;
    private readonly UserManager<User> _userManager;

    public UsersController(
        UserManager<User> userManager,
        Protector protector
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
            @event: Event.RegistrationAttempted,
            request: Request,
            operation: registration
        );
        var result = await _userManager.CreateAsync(
            user: user,
            password: registration.Password
        );
        if (result.Succeeded)
        {
            var policy = await _protector.Protect(
                @event: Event.RegistrationSucceeded,
                user: user,
                token: registration.ProtectionToken,
                httpContext: HttpContext
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
            @event: Event.RegistrationFailed,
            request: Request,
            operation: registration
        );

        foreach (var error in result.Errors)
            ModelState.AddModelError(key: string.Empty, errorMessage: error.Description);

        return View(
            model: registration
        );
    }
}
