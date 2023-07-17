using MicropostsApp.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace MicropostsApp.Data;

public class ApplicationDbContext : IdentityDbContext<User>
{
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options
    )
        : base(
            options: options
        )
    {
    }

    public DbSet<Micropost> Micropost { get; set; }
    public DbSet<Session> Session { get; set; }

    protected override void OnModelCreating(
        ModelBuilder modelBuilder
    )
    {
        base.OnModelCreating(
            builder: modelBuilder
        ); // This line is needed for Identity

        modelBuilder.Entity<Micropost>().ToTable(
            name: "Micropost"
        );
    }

    // Other properties...
}