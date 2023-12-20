using Backend.Models.enums;

namespace Backend.Models.classes
{
    public class Owner : User
    {
        public ICollection<OwnerShipment> OwnerShipments { get; set; } = new List<OwnerShipment>();
        public ICollection<Shipment> Shipments { get; set; } = new List<Shipment>();
    }
}