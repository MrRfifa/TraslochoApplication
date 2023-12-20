using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Backend.Models.enums;

namespace Backend.Dtos.RegisterUsers
{
    public class RegisterTransporterDto : RegisterUserDto
    {
        [Required(ErrorMessage = "The transporter type is required.")]
        public TransporterType TransporterType { get; set; }
    }
}