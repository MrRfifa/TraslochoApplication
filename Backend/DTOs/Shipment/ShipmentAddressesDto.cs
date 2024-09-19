
using System.ComponentModel.DataAnnotations;
using Backend.DTOs.Address;

namespace Backend.DTOs.Shipment
{
    public class ShipmentAddressesDto
    {
        [Required(ErrorMessage = "Origin Address is required.")]
        public CreateAddressDto OriginAddress { get; set; } = new CreateAddressDto();

        [Required(ErrorMessage = "Destination Address is required.")]
        public CreateAddressDto DestinationAddress { get; set; } = new CreateAddressDto();
    }
}