using MicropostsApp.Models;

namespace MicropostsApp.Interfaces;

public interface Protector
{
    public Task<Protectable> Protect(
        Event @event,
        User? user,
        string token,
        HttpContext httpContext
    );

    public Task NotifyOf(
        Event @event,
        HttpRequest request,
        UserOperation operation
    );
}