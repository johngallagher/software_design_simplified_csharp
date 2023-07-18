using System.ComponentModel.DataAnnotations;

namespace MicropostsApp.Models;

public class Micropost
{
    public int Id { get; set; }

    [Required] public string Content { get; set; }

    // Other properties...
}
