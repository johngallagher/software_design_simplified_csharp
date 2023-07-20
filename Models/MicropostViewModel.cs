using System.ComponentModel.DataAnnotations;

namespace MicropostsApp.Models;

public class MicropostViewModel
{
    public int Id { get; set; }

    [Required] public string Content { get; set; }

    [Required] public string ProtectionToken { get; set; }
}