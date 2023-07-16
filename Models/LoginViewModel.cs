using System.ComponentModel.DataAnnotations;
public class LoginViewModel
{
  [Required]
  [EmailAddress]
  public string Email { get; set; }

  [Required]
  [DataType(DataType.Password)]
  public string Password { get; set; }

  [Display(Name = "Remember me?")]
  public bool RememberMe { get; set; }

  [Required]
  public string castle_request_token { get; set; }
}
