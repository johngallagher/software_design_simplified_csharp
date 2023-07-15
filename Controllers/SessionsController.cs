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

        public SessionsController(ApplicationDbContext context, UserManager<User> userManager, SignInManager<User> signInManager)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login(LoginViewModel model)
        {

            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, isPersistent: false, lockoutOnFailure: false);
            if (result.Succeeded)
            {
                return RedirectToAction("Index", "Home");
            }
            else
            {

                ModelState.AddModelError(string.Empty, result.ToString());
                return View(model);
            }
        }

        // // GET: Sessions/Create
        // public IActionResult Create()
        // {
        //     var user = new User();
        //     return View(user);
        // }

        // POST: Sessions/Create
        // [HttpPost]
        // [ValidateAntiForgeryToken]
        // public async Task<IActionResult> Create(User user)
        // {
        //     if (ModelState.IsValid)
        //     {
        //         var result = await _signInManager.PasswordSignInAsync(user.Email, user.PasswordHash, false, lockoutOnFailure: false);
        //         if (result.Succeeded)
        //         {
        //             return RedirectToAction("Index", "Home");  // Redirect to the home page if login is successful
        //         }
        //         else
        //         {
        //             ModelState.AddModelError(string.Empty, "Invalid login attempt.");
        //             return View(user);
        //         }
        //     }
        //     return View(user);
        // }
    }
}

