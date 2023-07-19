using Castle;
using MicropostsApp.Interfaces;
using MicropostsApp.Models;

namespace MicropostsApp.Services.Protectors;

public class AwsProtector : Protector
{
    private readonly Cloudflare _cloudflare;
    private readonly CastleClient _client;

    public AwsProtector(Cloudflare cloudflare, CastleClient client)
    {
        _cloudflare = cloudflare;
        _client = client;
    }

    public Task<Protectable> Protect(
        Event @event,
        User? user,
        string token,
        HttpContext httpContext
    )
    {
        throw new NotImplementedException();
    }

    public Task NotifyOf(
        Event @event,
        HttpRequest request,
        UserOperation operation
    )
    {
        throw new NotImplementedException();
    }
}