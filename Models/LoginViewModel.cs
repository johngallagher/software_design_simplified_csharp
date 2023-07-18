using System.ComponentModel.DataAnnotations;
using MicropostsApp.Interfaces;

namespace MicropostsApp.Models;

public class LoginViewModel : IViewModel
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

    [Required] public string castle_request_token { get; set; }
}