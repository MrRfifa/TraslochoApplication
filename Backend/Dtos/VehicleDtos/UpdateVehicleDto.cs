
using Backend.Models.enums;

namespace Backend.Dtos.VehicleDtos
{
    public record UpdateVehicleDto
    {
        public string Manufacture { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public int Year { get; set; }
        public string Color { get; set; } = string.Empty;
        public VehicleType VehicleType { get; set; }
        public float Length { get; set; }
        public float Height { get; set; }
    }
}