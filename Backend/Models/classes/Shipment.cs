using Backend.Models.Classes.AddressesEntities;
using Backend.Models.Classes.ImagesEntities;
using Backend.Models.Classes.UsersEntities;
using Backend.Models.Enums;

namespace Backend.Models.Classes
{
    public class Shipment
    {
        public int Id { get; set; }
        public ShipmentType ShipmentType { get; set; }
        public ShipmentStatus ShipmentStatus { get; set; }
        public DateTime ShipmentDate { get; set; }
        public int Price { get; set; }
        public float DistanceBetweenAddresses { get; set; }
        public string Description { get; set; } = string.Empty;
        public int OwnerId { get; set; }
        public Owner? Owner { get; set; }
        public int? TransporterId { get; set; }
        public Transporter? Transporter { get; set; }
        public ICollection<Request>? Requests { get; set; }
        public ICollection<ShipmentImage>? Images { get; set; }

        // Required Addresses
        public int? OriginAddressId { get; set; }
        public ShipmentAddress? OriginAddress { get; set; }

        public int? DestinationAddressId { get; set; }
        public ShipmentAddress? DestinationAddress { get; set; }
    }
}