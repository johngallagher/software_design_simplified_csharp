using Castle;
using Castle.Messages.Requests;
using Castle.Infrastructure.Exceptions;
using Castle.Messages.Responses;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MicropostsApp.Data;

namespace MicropostsApp.Controllers
{
    public class SessionsController : Controller
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly ApplicationDbContext _context;
        private readonly CastleClient _castleClient;
        private readonly Cloudflare _cloudflare;

        public SessionsController(ApplicationDbContext context, UserManager<User> userManager, SignInManager<User> signInManager, CastleClient castleClient, Cloudflare cloudflare)
        {
            _context = context;
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
        public async Task<IActionResult> Create(LoginViewModel model)
        {

            if (!ModelState.IsValid)
            {
                return View(model);
            }
            
            var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, isPersistent: false, lockoutOnFailure: false);
            if (result.Succeeded)
            {
                var hackerLikelihood = await FetchHackerLikelihood(model);

                if (hackerLikelihood <= 0.6)
                {
                    return RedirectToAction("Index", "Home");
                }
                else if (hackerLikelihood > 0.6 && hackerLikelihood < 0.9)
                {
                    await ChallengeIpAddress();
                    return RedirectToAction("Index", "Home");
                }
                else
                {
                    await BlockIpAddress();
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

        private async Task ChallengeIpAddress()
        {
            var ipAddress = GetIpAddress(Request.HttpContext);
            await _cloudflare.ChallengeIpAsync(ipAddress);
        }

        private async Task BlockIpAddress()
        {
            var ipAddress = GetIpAddress(Request.HttpContext);
            await _cloudflare.BlockIpAsync(ipAddress);
        }

        private async Task<float> FetchHackerLikelihood(LoginViewModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            var res = await _castleClient.Risk(new ActionRequest()
            {
                Type = "$login",
                Status = "$succeeded",
                RequestToken = model.castle_request_token,
                Context = Castle.Context.FromHttpRequest(Request),
                User = new Dictionary<string, object>()
                {
                    { "id", user.Id },
                    { "email", user.Email },
                }
            });
            return res.Risk;
        }

        public string GetIpAddress(HttpContext context)
        {
            if (context.Request.Headers.TryGetValue("X-Forwarded-For", out var forwardedFor))
            {
                var ips = forwardedFor.ToString().Split(',', StringSplitOptions.TrimEntries);
                return ips[0];
            }

            return context.Connection.RemoteIpAddress.ToString();
        }

    }
}

