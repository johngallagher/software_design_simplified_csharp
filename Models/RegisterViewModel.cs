using System.ComponentModel.DataAnnotations;

namespace MicropostsApp.Models;

public class RegisterViewModel
{
    [Required]
    [EmailAddress]
    [Display(
        Name = "Email"
    )]
    public string Email { get; set; }

    [Required]
    [StringLength(
        maximumLength: 100,
        ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.",
        MinimumLength = 6
    )]
    [DataType(
        dataType: DataType.Password
    )]
    [Display(
        Name = "Password"
    )]
    public string Password { get; set; }

    [DataType(
        dataType: DataType.Password
    )]
    [Display(
        Name = "Confirm password"
    )]
    [Compare(
        otherProperty: "Password",
        ErrorMessage = "The password and confirmation password do not match."
    )]
    public string ConfirmPassword { get; set; }

    public string castle_request_token { get; set; }
}