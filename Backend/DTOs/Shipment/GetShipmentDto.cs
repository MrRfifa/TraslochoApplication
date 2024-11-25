
using Backend.Models.Classes.AddressesEntities;
using Backend.Models.Enums;

namespace Backend.DTOs.Shipment
{
    public class GetShipmentDto
    {
        public ShipmentType ShipmentType { get; set; }
        public ShipmentStatus ShipmentStatus { get; set; }
        public DateTime ShipmentDate { get; set; }
        public int Price { get; set; }
        public float DistanceBetweenAddresses { get; set; }
        public int DestinationAddressId { get; set; }
        public int OriginAddressId { get; set; }
        public string Description { get; set; } = string.Empty;
        public int OwnerId { get; set; }
        public int TransporterId { get; set; }
        public int VehicleId { get; set; }
    }
}