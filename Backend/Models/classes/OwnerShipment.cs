using Backend.Models.classes.UsersEntities;

namespace Backend.Models.classes
{
    public class OwnerShipment
    {
        public int OwnerShipmentId { get; set; }
        public int OwnerId { get; set; }
        public int ShipmentId { get; set; }
        public Owner? Owner { get; set; }
        public Shipment? Shipment { get; set; }
    }
}