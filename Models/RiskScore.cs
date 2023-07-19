using MicropostsApp.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace MicropostsApp.Models;

public class RiskScore : IProtectable
{
    public RiskScore(
        float score
    )
    {
        Score = score;
    }

    private float Score { get; set; }
    private const float High = 0.8f;
    private const float Medium = 0.6f;

    public bool Deny()
    {
        return Score >= High;
    }

    public bool Challenge()
    {
        return Score >= Medium && Score < High;
    }
}
