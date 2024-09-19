
using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Request
{
    public class CreateRequestDto
    {
        [Required(ErrorMessage = "Transporter is required.")]
        public int TransporterId { get; set; }

        [Required(ErrorMessage = "Shipment is required.")]
        public int ShipmentId { get; set; }
    }
}