
using Backend.Dtos.AddressDto;
using Backend.Models.classes;
using Backend.Models.enums;

namespace Backend.Dtos.Shipment
{
    public record CreateShipmentDto
    {
        public ShipmentType ShipmentType { get; set; }
        public DateTime ShipmentDate { get; set; }
        public int Price { get; set; }
        public CreateAddressDto Address { get; set; } = new CreateAddressDto();
        public string Description { get; set; } = string.Empty;

    }
}