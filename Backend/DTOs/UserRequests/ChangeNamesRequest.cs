using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.DTOs.UserRequests
{
    public class ChangeNamesRequest
    {
        [Required(ErrorMessage = "Password is required.")]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters.")]
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewFirstname { get; set; } = string.Empty;
        public string NewLastname { get; set; } = string.Empty;
    }
}