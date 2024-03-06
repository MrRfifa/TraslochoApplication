using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Dtos.Requests
{
    public record ChangeDobRequest
    {
        [Required(ErrorMessage = "Date Of Birth is required.")]
        public DateTime newDob { get; set; }

        [Required(ErrorMessage = "Password is required.")]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters.")]
        public string CurrentPassword { get; set; } = string.Empty;
    }
}