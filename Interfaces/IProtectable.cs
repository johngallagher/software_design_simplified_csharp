namespace MicropostsApp.Models;

public interface IProtectable
{
    bool Deny();
    bool Challenge();
}