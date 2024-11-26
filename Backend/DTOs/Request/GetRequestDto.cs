
using Backend.Models.Enums;

namespace Backend.DTOs.Request
{
    public class GetRequestDto
    {
        public int Id { get; set; }
        public int TransporterId { get; set; }
        public int ShipmentId { get; set; }
        public RequestStatus Status { get; set; }

        //Transporter details
        public string FirstName { get; set; }=string.Empty;
        public string LastName { get; set; }=string.Empty;
    }
}