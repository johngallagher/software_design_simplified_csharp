using MicropostsApp.Data;
using MicropostsApp.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace MicropostsApp.Controllers;

public class UsersController : Controller
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<User> _userManager;

    public UsersController(
        ApplicationDbContext context,
        UserManager<User> userManager
    )
    {
        _context = context;
        _userManager = userManager;
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
        if (ModelState.IsValid)
        {
            var user = new User { UserName = model.Email, Email = model.Email };
            var result = await _userManager.CreateAsync(
                user: user,
                password: model.Password
            );

            if (result.Succeeded)
            {
                var emailConfirmationToken = await _userManager.GenerateEmailConfirmationTokenAsync(
                    user: user
                );
                await _userManager.ConfirmEmailAsync(
                    user: user,
                    token: emailConfirmationToken
                );

                return RedirectToAction(
                    actionName: "Index",
                    controllerName: "Home"
                );
            }

            foreach (var error in result.Errors)
                ModelState.AddModelError(
                    key: string.Empty,
                    errorMessage: error.Description
                );
        }

        return View(
            model: model
        );
    }
}