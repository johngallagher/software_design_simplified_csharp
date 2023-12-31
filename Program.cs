using Amazon;
using Amazon.FraudDetector;
using MicropostsApp.Data;
using MicropostsApp.Interfaces;
using MicropostsApp.Models;
using MicropostsApp.Services;
using MicropostsApp.Services.Protectors;
using Microsoft.EntityFrameworkCore;

internal class Program
{
    private static void Main(
        string[] args
    )
    {
        var builder = WebApplication.CreateBuilder(
            args: args
        );

        builder.Services.AddDbContext<ApplicationDbContext>(
            optionsAction: options => options.UseNpgsql(
                connectionString: builder.Configuration.GetConnectionString(
                    name: "DefaultConnection"
                )
            )
        );

        builder.Services.AddDefaultIdentity<User>(
            configureOptions: options => options.SignIn.RequireConfirmedAccount = true
        ).AddEntityFrameworkStores<ApplicationDbContext>();

        builder.Services.AddControllersWithViews();

        builder.Services.AddSingleton<Protector>(
            implementationInstance: new AwsProtector(
                cloudflare: new Cloudflare(
                    email: builder.Configuration[key: "Cloudflare:Email"],
                    apiKey: builder.Configuration[key: "Cloudflare:Key"]
                ),
                client: new AmazonFraudDetectorClient(
                    awsAccessKeyId: builder.Configuration[key: "Amazon:AwsAccessKeyId"],
                    awsSecretAccessKey: builder.Configuration[key: "Amazon:AwsSecretAccessKey"],
                    region: RegionEndpoint.EUWest1
                )
            )
        );

        var app = builder.Build();

        if (!app.Environment.IsDevelopment())
        {
            app.UseExceptionHandler(
                errorHandlingPath: "/Home/Error"
            );
            app.UseHsts();
        }

        app.UseHttpsRedirection();
        app.UseStaticFiles();

        app.UseRouting();

        app.UseAuthorization();

        app.MapControllerRoute(
            name: "default",
            pattern: "{controller=Home}/{action=Index}/{id?}"
        );

        app.Run();
    }
}