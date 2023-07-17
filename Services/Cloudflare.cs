using System.Text;
using Newtonsoft.Json;

public class Cloudflare
{
    private readonly HttpClient _httpClient;

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

    public async Task PreventIpAddress(
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