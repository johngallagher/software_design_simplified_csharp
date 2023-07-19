using Castle.Messages;
using MicropostsApp.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace MicropostsApp.Models;

public class Policy : IProtectable
{
    private readonly ActionType _action;

    public Policy(ActionType action)
    {
        _action = action;
    }

    public bool Deny()
    {
        return _action == ActionType.Deny;
    }

    public bool Challenge()
    {
        return _action == ActionType.Challenge;
    }
}
