namespace Backend.Models.Classes.AddressesEntities
{
    public class ShipmentAddress : Address
    {
        public int ShipmentId { get; set; }
        public Shipment? Shipment { get; set; }
    }
}