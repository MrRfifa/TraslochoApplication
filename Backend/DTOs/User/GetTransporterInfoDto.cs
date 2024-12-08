
using Backend.DTOs.Address;
using Backend.DTOs.Review;
using Backend.DTOs.Vehicle;
using Backend.Models.Classes;
using Backend.Models.Enums;

namespace Backend.DTOs.User
{
    public class GetTransporterInfoDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public byte[] FileContentBase64 { get; set; } = Array.Empty<byte>();
        public DateTime DateOfBirth { get; set; }
        public GetAddressDto? UserAddress { get; set; }
        public TransporterType TransporterType { get; set; }
        public GetVehicleDto? Vehicle { get; set; }
        public ICollection<GetReviewDto> TransporterReviews { get; set; } = new List<GetReviewDto>();
    }
}