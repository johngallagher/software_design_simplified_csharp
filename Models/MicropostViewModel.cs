using System.ComponentModel.DataAnnotations;

namespace MicropostsApp.Models;

public class MicropostViewModel
{
    public int Id { get; set; }

    [Required] public string Content { get; set; }

    [Required] public string CastleRequestToken { get; set; }

    public string ProtectionToken
    {
        get { return this.CastleRequestToken; }
    }
}