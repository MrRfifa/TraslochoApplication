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
        public Address Address { get; set; } = new Address();
        public int AddressId { get; set; } 
        public string Description { get; set; } = string.Empty;
        public Owner Owner { get; set; } = new Owner();
        public int OwnerId { get; set; }
        public Transporter Transporter { get; set; } = new Transporter();
        public int TransporterId { get; set; }
        public Vehicle Vehicle { get; set; } = new Vehicle();
        public int VehicleId { get; set; }
        public ICollection<OwnerShipment> OwnerShipments { get; set; } = new List<OwnerShipment>();
        public ICollection<TransporterShipment> TransporterShipments { get; set; } = new List<TransporterShipment>();

    }
}