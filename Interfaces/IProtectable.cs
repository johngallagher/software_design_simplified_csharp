using Microsoft.AspNetCore.Mvc;

namespace MicropostsApp.Interfaces;

public interface IProtectable
{
    bool Deny();
    bool Challenge();
}