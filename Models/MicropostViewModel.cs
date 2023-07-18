using System.ComponentModel.DataAnnotations;
using MicropostsApp.Interfaces;

namespace MicropostsApp.Models;

public class MicropostViewModel
{
    public int Id { get; set; }

    [Required] public string Content { get; set; }

    [Required] public string castle_request_token { get; set; }
}