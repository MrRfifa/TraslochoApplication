using System.ComponentModel.DataAnnotations;
using Backend.Models.enums;

namespace Backend.Dtos.VehicleDtos
{
    public record CreateVehicleDto
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
        public ICollection<IFormFile> VehicleImages { get; set; } = new List<IFormFile>();
    }
}