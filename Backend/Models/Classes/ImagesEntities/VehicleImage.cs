
namespace Backend.Models.Classes.ImagesEntities
{
    public class VehicleImage : ImageFile
    {
        public int VehicleId { get; set; }
        public Vehicle? Vehicle { get; set; }
    }
}