using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using MicropostsApp.Data;
using MicropostsApp.Models;
using Microsoft.AspNetCore.Authorization;

namespace MicropostsApp.Controllers
{
    [Authorize]
    public class MicropostsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public MicropostsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Microposts
        public async Task<IActionResult> Index()
        {
            return View(await _context.Micropost.ToListAsync());
        }

        // GET: Microposts/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Microposts/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Content")] Micropost micropost)
        {
            if (ModelState.IsValid)
            {
                _context.Add(micropost);
                await _context.SaveChangesAsync();
                return RedirectToAction("Index", "Home");
            }
            return View(micropost);
        }

        // Other actions...
    }
}
