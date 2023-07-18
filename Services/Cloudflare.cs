using System.Text;
using Newtonsoft.Json;

namespace MicropostsApp.Services;

public class Cloudflare
{
    private static HttpClient _httpClient = null!;

    public Cloudflare(
        string email,
        string apiKey
    )
    {
        _httpClient = new HttpClient
        {
            BaseAddress = new Uri(
                uriString: "https://api.cloudflare.com/client/v4/"
            )
        };
        _httpClient.DefaultRequestHeaders.Add(
            name: "X-Auth-Email",
            value: email
        );
        _httpClient.DefaultRequestHeaders.Add(
            name: "X-Auth-Key",
            value: apiKey
        );
    }

    public async Task Block(
        HttpContext context
    )
    {
        var ipAddress = GetIpAddress(
            context: context
        );
        await PreventIpAddress(
            ipAddress: ipAddress,
            mode: "block"
        );
    }

    public async Task Challenge(
        HttpContext context
    )
    {
        var ipAddress = GetIpAddress(
            context: context
        );
        await PreventIpAddress(
            ipAddress: ipAddress,
            mode: "challenge"
        );
    }

    private static string GetIpAddress(
        HttpContext context
    )
    {
        if (context.Request.Headers.TryGetValue(
                key: "X-Forwarded-For",
                value: out var forwardedFor
            ))
        {
            var ips = forwardedFor.ToString().Split(
                separator: ',',
                options: StringSplitOptions.TrimEntries
            );
            return ips[0];
        }

        return context.Connection.RemoteIpAddress?.ToString() ?? string.Empty;
    }

    private static async Task PreventIpAddress(
        string ipAddress,
        string mode
    )
    {
        var rule = new
        {
            mode,
            configuration = new
            {
                target = "ip",
                value = ipAddress
            },
            notes = "This rule blocks a specific IP"
        };

        var content = new StringContent(
            content: JsonConvert.SerializeObject(
                value: rule
            ),
            encoding: Encoding.UTF8,
            mediaType: "application/json"
        );
        await _httpClient.PostAsync(
            requestUri: "accounts/a4bedc9e66fe2e421c76b068531a75a2/firewall/access_rules/rules",
            content: content
        );
    }
}