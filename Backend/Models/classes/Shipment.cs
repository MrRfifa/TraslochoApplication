using Backend.Models.classes.UsersEntities;
using Backend.Models.enums;
using System;
using System.Collections.Generic;

namespace Backend.Models.classes
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
        public int? TransporterId { get; set; }
        public int? VehicleId { get; set; }
        public int OriginAddressId { get; set; } // Foreign key ID for the origin address
        public int DestinationAddressId { get; set; } // Foreign key ID for the destination address

        // Navigation properties (optional, but helpful for EF Core)
        public Owner? Owner { get; set; }
        public Transporter? Transporter { get; set; }
        public Vehicle? Vehicle { get; set; }
        public ShipmentAddress? OriginAddress { get; set; }// Navigation property for origin address
        public ShipmentAddress? DestinationAddress { get; set; }// Navigation property for destination address
        public ICollection<Request>? Requests { get; set; }
        public ICollection<ShipmentImage>? Images { get; set; }
        public ICollection<OwnerShipment>? OwnerShipments { get; set; }
        public ICollection<TransporterShipment>? TransporterShipments { get; set; }
    }
}
