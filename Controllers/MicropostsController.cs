using Castle;
using Castle.Messages.Requests;
using MicropostsApp.Data;
using MicropostsApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MicropostsApp.Controllers;

[Authorize]
public class MicropostsController : Controller
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<User> _userManager;
    private readonly CastleClient _castleClient;
    private readonly Cloudflare _cloudflare;

    public MicropostsController(
        ApplicationDbContext context,
        UserManager<User> userManager,
        CastleClient castleClient,
        Cloudflare cloudflare
    )
    {
        _context = context;
        _userManager = userManager;
        _castleClient = castleClient;
        _cloudflare = cloudflare;
    }

    // GET: Microposts
    public async Task<IActionResult> Index()
    {
        return View(
            model: await _context.Micropost.ToListAsync()
        );
    }

    // GET: Microposts/Create
    public IActionResult Create()
    {
        return View();
    }

    private const float HighRiskThreshold = 0.8f;
    private const float MediumRiskThreshold = 0.6f;

    // POST: Microposts/Create
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(
        MicropostViewModel model
    )
    {
        if (!ModelState.IsValid)
            return View(
                model: model
            );

        var hackerLikelihood = await FetchHackerLikelihood(
            type: "$custom",
            name: "Created a micropost",
            model: model
        );

        if (hackerLikelihood >= HighRiskThreshold)
        {
            await BlockIpAddress();
            Response.StatusCode = 500;
            return View(
                viewName: "Error500"
            );
        }

        if (hackerLikelihood >= MediumRiskThreshold && hackerLikelihood < HighRiskThreshold)
        {
            await ChallengeIpAddress();
        }

        _context.Add(
            entity: new Micropost()
            {
                Content = model.Content
            }
        );
        await _context.SaveChangesAsync();
        return RedirectToAction(
            actionName: "Index",
            controllerName: "Microposts"
        );
    }

    private async Task<float> FetchHackerLikelihood(
        string type,
        string name,
        MicropostViewModel model
    )
    {
        var user = await _userManager.GetUserAsync(
            User
        );

        if (user == null) return 0;
        var response = await _castleClient.Risk(
            request: new ActionRequest
            {
                Type = type,
                Name = name,
                RequestToken = model.castle_request_token,
                Context = Context.FromHttpRequest(
                    request: Request
                ),
                User = new Dictionary<string, object>
                {
                    { "id", user.Id },
                    { "email", user.Email ?? string.Empty }
                }
            }
        );
        return response.Risk;
    }

    private async Task ChallengeIpAddress()
    {
        var ipAddress = GetIpAddress(
            context: Request.HttpContext
        );
        await _cloudflare.PreventIpAddress(
            ipAddress: ipAddress,
            mode: "challenge"
        );
    }

    private async Task BlockIpAddress()
    {
        var ipAddress = GetIpAddress(
            context: Request.HttpContext
        );
        await _cloudflare.PreventIpAddress(
            ipAddress: ipAddress,
            mode: "block"
        );
    }

    public string GetIpAddress(
        HttpContext context
    )
    {
        if (context.Request.Headers.TryGetValue(
                key: "X-Forwarded-For",
                value: out var forwardedFor
            ))
        {
            var ips = forwardedFor.ToString().Split(
                separator: ',',
                options: StringSplitOptions.TrimEntries
            );
            return ips[0];
        }

        return context.Connection.RemoteIpAddress?.ToString() ?? string.Empty;
    }
}