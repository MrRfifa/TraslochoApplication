using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Backend.Models.classes;
using Backend.Models.enums;

namespace Backend.Dtos.Vehicle
{
    public record GetVehicleDto
    {
        [Required(ErrorMessage = "Manufacture is required.")]
        public string Manufacture { get; set; } = string.Empty;

        [Required(ErrorMessage = "Model is required.")]
        public string Model { get; set; } = string.Empty;

        [Required(ErrorMessage = "Year is required.")]
        public int Year { get; set; }

        [Required(ErrorMessage = "Color is required.")]
        public string Color { get; set; } = string.Empty;

        [Required(ErrorMessage = "The type is required.")]
        public VehicleType VehicleType { get; set; }

        [Required(ErrorMessage = "Length is required.")]
        public float Length { get; set; }

        [Required(ErrorMessage = "Height is required.")]
        public float Height { get; set; }

        [Required(ErrorMessage = "At least one vehicle image is required.")]
        public ICollection<VehicleImage>? VehicleImages { get; set; }
    }
}