using Microsoft.AspNetCore.Mvc;

namespace MicropostsApp.Interfaces;

public interface Protectable
{
    bool Deny();
    bool Challenge();
}
