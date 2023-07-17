using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

public class Cloudflare
{
  private readonly HttpClient _httpClient;

  public Cloudflare(string email, string apiKey)
  {
    _httpClient = new HttpClient
    {
      BaseAddress = new Uri("https://api.cloudflare.com/client/v4/")
    };
    _httpClient.DefaultRequestHeaders.Add("X-Auth-Email", email);
    _httpClient.DefaultRequestHeaders.Add("X-Auth-Key", apiKey);
  }

  public async Task BlockIpAsync(string ipAddress)
  {
    var rule = new
    {
      mode = "block",
      configuration = new
      {
        target = "ip",
        value = ipAddress
      },
      notes = "This rule blocks a specific IP"
    };

    var content = new StringContent(JsonConvert.SerializeObject(rule), Encoding.UTF8, "application/json");
    await _httpClient.PostAsync("accounts/a4bedc9e66fe2e421c76b068531a75a2/firewall/access_rules/rules", content);
  }

  public async Task ChallengeIpAsync(string ipAddress)
  {
    var rule = new
    {
      mode = "challenge",
      configuration = new
      {
        target = "ip",
        value = ipAddress
      },
      notes = "This rule challenges a specific IP"
    };

    var content = new StringContent(JsonConvert.SerializeObject(rule), Encoding.UTF8, "application/json");
    await _httpClient.PostAsync("accounts/a4bedc9e66fe2e421c76b068531a75a2/firewall/access_rules/rules", content);
  }
}
