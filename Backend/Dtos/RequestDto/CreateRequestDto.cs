using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos.RequestDto
{
    public record CreateRequestDto
    {
        [Required(ErrorMessage = "Transporter is required.")]
        public int TransporterId { get; set; }

        [Required(ErrorMessage = "Shipment is required.")]
        public int ShipmentId { get; set; }

    }
}