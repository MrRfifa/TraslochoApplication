
namespace Backend.DTOs.Vehicle
{
    public class UpdateVehicleImagesDto
    {
        // Use basic serializable types for properties
        public List<IFormFile> VehicleImages { get; set; } = new List<IFormFile>();
    }
}