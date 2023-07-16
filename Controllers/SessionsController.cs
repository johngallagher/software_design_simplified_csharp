using Castle;
using Castle.Messages.Requests;
using Castle.Infrastructure.Exceptions;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MicropostsApp.Data;
using MicropostsApp.Models;

namespace MicropostsApp.Controllers
{
    public class SessionsController : Controller
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly ApplicationDbContext _context;
        private readonly CastleClient _castleClient;

        public SessionsController(ApplicationDbContext context, UserManager<User> userManager, SignInManager<User> signInManager, CastleClient castleClient)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
            _castleClient = castleClient;
        }

        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Create(LoginViewModel model)
        {

            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, isPersistent: false, lockoutOnFailure: false);
            if (result.Succeeded)
            {
                var user = await _userManager.FindByEmailAsync(model.Email);
                var res = await _castleClient.Risk(new ActionRequest()
                {
                    Type = "$login",
                    Status = "$succeeded",
                    RequestToken = model.castle_request_token,
                    Context = Castle.Context.FromHttpRequest(Request),
                    User = new Dictionary<string, object>() {
                        {"id", user.Id},
                        {"email", user.Email},
                    }
                });

                if (res.Risk <= 0.6)
                {
                    return RedirectToAction("Index", "Home");
                }
                else if (res.Risk > 0.6 && res.Risk < 0.9)
                {
                    // Challenge IP address
                    return RedirectToAction("Index", "Home");
                }
                else
                {
                    // Block IP address
                    Response.StatusCode = 500;
                    return View("Error500");
                }
            }
            else
            {

                ModelState.AddModelError(string.Empty, result.ToString());
                return View(model);
            }
        }
    }
}

