using Backend.Models.Classes.UsersEntities;
using Backend.Models.Enums;

namespace Backend.Models.Classes
{
    public class Request
    {
        public int RequestId { get; set; } // Unique identifier for easier lookups
        public int ShipmentId { get; set; }
        public int TransporterId { get; set; }
        public RequestStatus Status { get; set; }

        // Navigation properties
        public Shipment? Shipment { get; set; }
        public Transporter? Transporter { get; set; }
    }
}