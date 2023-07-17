using MicropostsApp.Data;
using MicropostsApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MicropostsApp.Controllers;

[Authorize]
public class MicropostsController : Controller
{
    private readonly ApplicationDbContext _context;

    public MicropostsController(
        ApplicationDbContext context
    )
    {
        _context = context;
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
        [Bind(
            include: "Id,Content"
        )]
        Micropost micropost
    )
    {
        if (ModelState.IsValid)
        {
            _context.Add(
                entity: micropost
            );
            await _context.SaveChangesAsync();
            return RedirectToAction(
                actionName: "Index",
                controllerName: "Home"
            );
        }

        return View(
            model: micropost
        );
    }

    // Other actions...
}