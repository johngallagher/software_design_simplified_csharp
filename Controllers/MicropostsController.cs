using Castle;
using MicropostsApp.Extensions;
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

        var riskScore = await this.FetchRiskScore(
            type: "$custom",
            model: model,
            castleClient: _castleClient,
            user: await _userManager.GetUserAsync(
                principal: User
            ),
            name: "Created a micropost"
        );
        if (riskScore >= HighRiskThreshold)
        {
            await this.BlockIpAddress(
                cloudflare: _cloudflare
            );
            Response.StatusCode = 500;
            return View(
                viewName: "Error500"
            );
        }

        if (riskScore >= MediumRiskThreshold && riskScore < HighRiskThreshold)
        {
            await this.ChallengeIpAddress(
                cloudflare: _cloudflare
            );
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
}