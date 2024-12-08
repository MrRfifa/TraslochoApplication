using Backend.Models.Enums;

namespace Backend.Models.Classes.UsersEntities
{
    public class Transporter : User
    {
        public TransporterType TransporterType { get; set; }
        public ICollection<Shipment>? Shipments { get; set; }
        public Vehicle? Vehicle { get; set; }
        public ICollection<Review>? TransporterReviews { get; set; }
        public ICollection<Request>? Requests { get; set; }
        // public ICollection<TransporterShipment>? TransporterShipments { get; set; }
    }
}