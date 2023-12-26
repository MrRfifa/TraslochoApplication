
using System.ComponentModel.DataAnnotations;
using Backend.Dtos.AddressDto;
using Backend.Models.classes;
using Backend.Models.enums;

namespace Backend.Dtos.Shipment
{
    public record CreateShipmentDto
    {
        [Required(ErrorMessage = "Shipment Type is required.")]
        public ShipmentType ShipmentType { get; set; }

        [Required(ErrorMessage = "Shipment Date is required.")]
        public DateTime ShipmentDate { get; set; }

        // [Required(ErrorMessage = "Destination Address is required.")]
        public int Price { get; set; }

        [Required(ErrorMessage = "Destination Address is required.")]
        public CreateAddressDto DestinationAddress { get; set; } = new CreateAddressDto();

        [Required(ErrorMessage = "Description is required.")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "At least one image is required.")]
        public ICollection<IFormFile> ShipmentImages { get; set; } = new List<IFormFile>();

    }
}