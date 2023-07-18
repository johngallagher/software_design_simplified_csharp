using System.ComponentModel.DataAnnotations;

namespace MicropostsApp.Models;

public class LoginViewModel
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

    [Required] public string CastleRequestToken { get; set; }
}
