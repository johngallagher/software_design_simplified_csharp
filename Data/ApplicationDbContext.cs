using Microsoft.EntityFrameworkCore;
using MicropostsApp.Models;

namespace MicropostsApp.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Micropost> Micropost { get; set; }
        public DbSet<User> User { get; set; }
        public DbSet<Session> Session { get; set; }

        // Other properties...
    }
}
