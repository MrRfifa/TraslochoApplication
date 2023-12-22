
using Backend.Models.classes;
using Backend.Models.enums;

namespace Backend.Dtos.Shipment
{
    public record GetShipmentDto
    {
        public ShipmentType ShipmentType { get; set; }
        public ShipmentStatus ShipmentStatus { get; set; }
        public DateTime ShipmentDate { get; set; }
        public int Price { get; set; }
        public int AddressId { get; set; }
        public string Description { get; set; } = string.Empty;
        public int OwnerId { get; set; }
        public int TransporterId { get; set; }
        public int VehicleId { get; set; }
    }
}