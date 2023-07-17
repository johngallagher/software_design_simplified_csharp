using MicropostsApp.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(
        string[] args
    )
    {
        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
        optionsBuilder.UseNpgsql(
            connectionString: "Host=localhost;Database=johngallagher;Username=johngallagher;Password="
        );

        return new ApplicationDbContext(
            options: optionsBuilder.Options
        );
    }
}