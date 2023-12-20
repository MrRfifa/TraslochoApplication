
namespace Backend.Models.classes
{
    public class TransporterShipment
    {
        public int TransporterShipmentId { get; set; }
        public int TransporterId { get; set; }
        public int ShipmentId { get; set; }
        public int VehicleId { get; set; }
        public Transporter Transporter { get; set; } = new Transporter();
        public Vehicle Vehicle { get; set; } = new Vehicle();
        public Shipment Shipment { get; set; } = new Shipment();
    }
}