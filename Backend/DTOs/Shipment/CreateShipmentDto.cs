
using System.ComponentModel.DataAnnotations;
using Backend.DTOs.Address;
using Backend.Models.Enums;

namespace Backend.DTOs.Shipment
{
    public class CreateShipmentDto
    {
        [Required(ErrorMessage = "Shipment Type is required.")]
        public ShipmentType ShipmentType { get; set; }

        [Required(ErrorMessage = "Shipment Date is required.")]
        public DateTime ShipmentDate { get; set; }

        [Required(ErrorMessage = "Description is required.")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "At least one image is required.")]
        public ICollection<IFormFile> ShipmentImages { get; set; } = new List<IFormFile>();
    }
}