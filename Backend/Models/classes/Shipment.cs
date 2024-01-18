using Backend.Models.classes.UsersEntities;
using Backend.Models.enums;

namespace Backend.Models.classes
{
    public class Shipment
    {
        public int Id { get; set; }
        public ShipmentType ShipmentType { get; set; }
        public ShipmentStatus ShipmentStatus { get; set; }
        public DateTime ShipmentDate { get; set; }
        public int Price { get; set; }
        public ShipmentAddress DestinationAddress { get; set; } = new ShipmentAddress();
        public float DistanceBetweenAddresses { get; set; }
        public string Description { get; set; } = string.Empty;
        public Owner? Owner { get; set; }
        public int OwnerId { get; set; }
        public Transporter? Transporter { get; set; }
        public int TransporterId { get; set; }
        public Vehicle? Vehicle { get; set; }
        public int VehicleId { get; set; }
        public ICollection<ShipmentImage>? Images { get; set; }
        public ICollection<OwnerShipment>? OwnerShipments { get; set; }
        public ICollection<TransporterShipment>? TransporterShipments { get; set; }
    }
}