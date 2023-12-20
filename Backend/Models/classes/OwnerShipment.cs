
namespace Backend.Models.classes
{
    public class OwnerShipment
    {
        public int OwnerShipmentId { get; set; }
        public int OwnerId { get; set; }
        public int ShipmentId { get; set; }
        public int VehicleId { get; set; }
        public Owner Owner { get; set; } = new Owner();
        public Shipment Shipment { get; set; } = new Shipment();
        public Vehicle Vehicle { get; set; } = new Vehicle();
    }
}