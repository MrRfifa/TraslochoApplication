using Backend.Models.enums;

namespace Backend.Models.classes.UsersEntities
{
    public class Transporter : User
    {
        public TransporterType TransporterType { get; set; }
        public ICollection<Shipment>? Shipments { get; set; }
        public ICollection<TransporterShipment>? TransporterShipments { get; set; }
        public ICollection<Vehicle>? Vehicles { get; set; }
        public ICollection<Review>? TransporterReviews { get; set; }
    }
}