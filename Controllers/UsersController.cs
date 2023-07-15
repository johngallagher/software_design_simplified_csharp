using Microsoft.AspNetCore.Mvc;
using MicropostsApp.Data;
using MicropostsApp.Models;
using Microsoft.AspNetCore.Authorization;

namespace MicropostsApp.Controllers
{
    public class UsersController : Controller
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Users/Create
        public IActionResult Create()
        {
            var user = new User();
            return View(user);
        }

        // POST: Users/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Email,Password")] User user)
        {
            if (ModelState.IsValid)
            {
                _context.Add(user);
                await _context.SaveChangesAsync();
                // Send activation email...
                return RedirectToAction("Index", "Home");
            }
            return View(user);
        }

        // Other actions...
    }
}
