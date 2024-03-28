// using System.Text.Json.Serialization;
using Backend.Models.classes.UsersEntities;
using Backend.Models.enums;

namespace Backend.Models.classes
{
    public class Request
    {
        public int Id { get; set; }
        public int TransporterId { get; set; }
        public int ShipmentId { get; set; }
        public RequestStatus Status { get; set; }

        // Navigation properties
        public Transporter? Transporter { get; set; }

        // [JsonIgnore]
        // public Shipment? Shipment { get; set; }
    }
}