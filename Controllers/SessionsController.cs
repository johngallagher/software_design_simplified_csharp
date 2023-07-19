using MicropostsApp.Models;
using MicropostsApp.Services.Protectors;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace MicropostsApp.Controllers;

public class SessionsController : Controller
{
    private readonly CastleProtector _protector;
    private readonly SignInManager<User> _signInManager;
    private readonly UserManager<User> _userManager;

    public SessionsController(
        UserManager<User> userManager,
        SignInManager<User> signInManager,
        CastleProtector protector
    )
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _protector = protector;
    }

    public IActionResult Create()
    {
        return View();
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        LoginViewModel login
    )
    {
        if (!ModelState.IsValid)
            return View(
                model: login
            );

        await _protector.NotifyOf(
            @event: Event.LoginAttempted,
            request: Request,
            operation: login
        );
        var result = await _signInManager.PasswordSignInAsync(
            userName: login.Email,
            password: login.Password,
            isPersistent: false,
            lockoutOnFailure: false
        );
        if (result.Succeeded)
        {
            var policy = await _protector.Protect(
                @event: Event.LoginSucceeded,
                user: await _userManager.FindByEmailAsync(email: login.Email),
                token: login.ProtectionToken,
                httpContext: HttpContext
            );

            if (policy.Deny())
            {
                Response.StatusCode = 500;
                return View(viewName: "Error500");
            }

            return RedirectToAction(actionName: "Index", controllerName: "Home");
        }

        await _protector.NotifyOf(
            @event: Event.LoginFailed,
            request: Request,
            operation: login
        );

        ModelState.AddModelError(
            key: string.Empty,
            errorMessage: result.ToString()
        );
        return View(
            model: login
        );
    }
}
