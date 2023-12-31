using Amazon.FraudDetector;
using Amazon.FraudDetector.Model;
using MicropostsApp.Interfaces;
using MicropostsApp.Models;
using Event = MicropostsApp.Models.Event;

namespace MicropostsApp.Services.Protectors;

public class AwsProtector : Protector
{
    private readonly Cloudflare _cloudflare;
    private readonly AmazonFraudDetectorClient _client;

    public AwsProtector(Cloudflare cloudflare, AmazonFraudDetectorClient client)
    {
        _cloudflare = cloudflare;
        _client = client;
    }

    public async Task<Protectable> Protect(
        Event @event,
        User? user,
        string token,
        HttpContext httpContext
    )
    {
        if (UseHardCodedToken(token: token, httpContext: httpContext))
            return PolicyFromToken(token: token);

        try
        {
            Protectable policy;
            if (user == null)
                policy = Policy.CreateAllow();
            else
            {
                var request = new GetEventPredictionRequest()
                {
                    DetectorId = "default_detector",
                    EventId = httpContext.Request.Headers.RequestId,
                    EventTypeName = ToTypeName(@event: @event),
                    EventVariables = new Dictionary<string, string>
                    {
                        { "email", user?.Email ?? string.Empty },
                        { "ip_address", GetIpAddress(context: httpContext) }
                    }
                };
                var response = await _client.GetEventPredictionAsync(
                    request: request
                );
                policy = Policy.FromResponse(response: response);
            }

            if (policy.Deny())
            {
                await _cloudflare.Block(context: httpContext);
            }

            if (policy.Challenge())
            {
                await _cloudflare.Challenge(context: httpContext);
            }

            return policy;
        }
        catch (AmazonFraudDetectorException)
        {
            return Policy.CreateAllow();
        }
    }

    private Protectable PolicyFromToken(string token)
    {
        if (ContainsDeny(token: token))
        {
            return Policy.CreateDeny();
        }

        if (ContainsChallenge(token: token))
        {
            return Policy.CreateChallenge();
        }

        return Policy.CreateAllow();
    }

    private static bool UseHardCodedToken(string token, HttpContext httpContext)
    {
        return httpContext.RequestServices.GetRequiredService<IWebHostEnvironment>().IsDevelopment() &&
            ContainsChallenge(token: token) || ContainsAllow(token: token) || ContainsDeny(token: token);
    }

    private static bool ContainsDeny(string token)
    {
        var containsDeny = token.Contains(value: "policy.action:deny");
        return containsDeny;
    }

    private static bool ContainsAllow(string token)
    {
        var containsAllow = token.Contains(value: "policy.action:allow");
        return containsAllow;
    }

    private static bool ContainsChallenge(string token)
    {
        var containsChallenge = token.Contains(value: "policy.action:challenge");
        return containsChallenge;
    }

    private class Policy : Protectable
    {
        private readonly string _outcome;

        private Policy(string outcome)
        {
            _outcome = outcome;
        }

        public static Policy CreateAllow()
        {
            return new Policy(outcome: "allow");
        }

        public static Protectable CreateChallenge()
        {
            return new Policy(outcome: "friction");
        }

        public static Protectable CreateDeny()
        {
            return new Policy(outcome: "fraud");
        }

        public static Policy FromResponse(GetEventPredictionResponse response)
        {
            var outcome = response.RuleResults[index: 0].Outcomes[index: 0] ?? "allow";
            return new Policy(outcome: outcome);
        }

        public bool Deny()
        {
            return _outcome == "fraud";
        }

        public bool Challenge()
        {
            return _outcome == "friction";
        }
    }

    public async Task NotifyOf(
        Event @event,
        HttpRequest request,
        UserOperation operation
    )
    {
        try
        {
            await _client.SendEventAsync(
                request: new SendEventRequest()
                {
                    EventId = request.Headers.RequestId,
                    EventTypeName = ToTypeName(@event: @event),
                    EventVariables = new Dictionary<string, string>
                    {
                        { "email", operation.Email },
                        { "ip_address", GetIpAddress(context: request.HttpContext) }
                    },
                    AssignedLabel = ToLabel(@event: @event)
                }
            );
        }
        catch (AmazonFraudDetectorException)
        {
        }
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

    private string ToTypeName(Event @event)
    {
        switch (@event)
        {
            case Event.LoginAttempted:
            case Event.LoginSucceeded:
            case Event.LoginFailed:
                return "login";
            case Event.RegistrationAttempted:
            case Event.RegistrationSucceeded:
            case Event.RegistrationFailed:
                return "registration";
            case Event.MicropostCreated:
                return "micropost";
            default:
                throw new ArgumentOutOfRangeException(
                    paramName: nameof(@event),
                    actualValue: @event,
                    message: "Invalid event name"
                );
        }
    }

    private string ToLabel(Event @event)
    {
        switch (@event)
        {
            case Event.LoginAttempted:
            case Event.RegistrationAttempted:
                return "friction";
            case Event.LoginSucceeded:
            case Event.RegistrationSucceeded:
                return "allow";
            case Event.LoginFailed:
            case Event.RegistrationFailed:
                return "fraud";
            default:
                throw new ArgumentOutOfRangeException(
                    paramName: nameof(@event),
                    actualValue: @event,
                    message: "Invalid event name"
                );
        }
    }
}