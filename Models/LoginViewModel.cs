using System.ComponentModel.DataAnnotations;
using MicropostsApp.Services.Protectors;

namespace MicropostsApp.Models;

public class LoginViewModel : UserOperation
{
    [Required] [EmailAddress] public string Email { get; set; }

    [Required]
    [DataType(
        dataType: DataType.Password
    )]
    public string Password { get; set; }

    [Display(
        Name = "Remember me?"
    )]
    public bool RememberMe { get; set; }

    [Required] public string ProtectionToken { get; set; }
}
