using Backend.Models.enums;

namespace Backend.Models.classes
{
    public class Owner : User
    {
        public ICollection<OwnerShipment>? OwnerShipments { get; set; }
        public ICollection<Shipment>? Shipments { get; set; }
    }
}