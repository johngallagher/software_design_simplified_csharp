using MicropostsApp.Data;
using MicropostsApp.Models;
using MicropostsApp.Services.Protectors;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MicropostsApp.Controllers;

[Authorize]
public class MicropostsController : Controller
{
    private readonly CastleProtector _castleProtector;
    private readonly ApplicationDbContext _context;
    private readonly UserManager<User> _userManager;

    public MicropostsController(
        ApplicationDbContext context,
        UserManager<User> userManager,
        CastleProtector castleProtector
    )
    {
        _context = context;
        _userManager = userManager;
        _castleProtector = castleProtector;
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

    // POST: Microposts/Create
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(
        MicropostViewModel model
    )
    {
        if (!ModelState.IsValid)
            return View(model: model);

        var policy = await _castleProtector.ProtectFromBadActors(
            controller: this,
            type: "$custom",
            name: "Created a micropost",
            user: await _userManager.GetUserAsync(
                principal: User
            ),
            castleRequestToken: model.CastleRequestToken
        );

        if (policy.Deny())
        {
            Response.StatusCode = 500;
            return View(viewName: "Error500");
        }

        _context.Add(
            entity: new Micropost
            {
                Content = model.Content
            }
        );
        await _context.SaveChangesAsync();
        return RedirectToAction(actionName: "Index", controllerName: "Microposts");
    }
}