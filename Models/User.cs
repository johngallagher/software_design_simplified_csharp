using System.ComponentModel.DataAnnotations;

namespace MicropostsApp.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        // Other properties...
    }
}
