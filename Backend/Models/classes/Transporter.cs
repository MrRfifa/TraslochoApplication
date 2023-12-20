using Backend.Models.enums;

namespace Backend.Models.classes
{
    public class Transporter : User
    {
        public TransporterType TransporterType { get; set; }
        public ICollection<Shipment> Shipments { get; set; } = new List<Shipment>();
        public ICollection<TransporterShipment> TransporterShipments { get; set; } = new List<TransporterShipment>();
        public ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();

    }
}