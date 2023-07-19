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
        LoginViewModel model
    )
    {
        if (!ModelState.IsValid)
            return View(
                model: model
            );

        await _protector.NotifyOf(
            type: "$login",
            status: "$attempted",
            userEmail: model.Email,
            castleRequestToken: model.CastleRequestToken,
            httpContext: HttpContext
        );
        var result = await _signInManager.PasswordSignInAsync(
            userName: model.Email,
            password: model.Password,
            isPersistent: false,
            lockoutOnFailure: false
        );
        if (result.Succeeded)
        {
            var policy = await _protector.Protect(
                user: await _userManager.FindByEmailAsync(email: model.Email),
                castleRequestToken: model.CastleRequestToken,
                httpContext: HttpContext,
                type: "$login",
                status: "$succeeded"
            );

            if (policy.Deny())
            {
                Response.StatusCode = 500;
                return View(viewName: "Error500");
            }

            return RedirectToAction(actionName: "Index", controllerName: "Home");
        }

        await _protector.NotifyOf(
            type: "$login",
            status: "$failed",
            userEmail: model.Email,
            castleRequestToken: model.CastleRequestToken,
            httpContext: HttpContext
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