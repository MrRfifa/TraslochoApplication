
using Backend.Models.classes.UsersEntities;
using Backend.Models.enums;

namespace Backend.Models.classes
{
    public class TransporterShipment
    {
        public int TransporterShipmentId { get; set; }
        public int TransporterId { get; set; }
        public int ShipmentId { get; set; }
        public int VehicleId { get; set; }
        public ShipmentStatus ShipmentStatus { get; set; }
        public Transporter? Transporter { get; set; }
        public Vehicle? Vehicle { get; set; }
        public Shipment? Shipment { get; set; }
    }
}