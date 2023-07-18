using System.ComponentModel.DataAnnotations;

namespace MicropostsApp.Models;

public class Session
{
    public int Id { get; set; }

    [Required] public string Email { get; set; }

    [Required] public string Password { get; set; }

    // Other properties...
}
