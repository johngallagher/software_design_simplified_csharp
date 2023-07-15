using Microsoft.AspNetCore.Mvc;
using MicropostsApp.Data;
using MicropostsApp.Models;
using Microsoft.AspNetCore.Authorization;

namespace MicropostsApp.Controllers
{
    public class SessionsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public SessionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Sessions/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Sessions/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Email,Password")] Session session)
        {
            if (ModelState.IsValid)
            {
                // Validate user and create session...
                return RedirectToAction(nameof(Index));
            }
            return View(session);
        }

        // Other actions...
    }
}
