using Backend.Models.classes.UsersEntities;
using Backend.Models.enums;

namespace Backend.Models.classes
{
    public class Vehicle
    {
        public int Id { get; set; }
        public string Manufacture { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public int Year { get; set; }
        public string Color { get; set; } = string.Empty;
        public VehicleType VehicleType { get; set; }
        public float Length { get; set; }
        public float Height { get; set; }

        // Foreign key for Transporter
        public int TransporterId { get; set; }
        public Transporter? Transporter { get; set; }
        public ICollection<VehicleImage>? VehicleImages { get; set; }
        public bool IsAvailable { get; set; }
        public ICollection<OwnerShipment>? OwnerShipments { get; set; }
        public ICollection<TransporterShipment>? TransporterShipments { get; set; }
    }
}
