using System.ComponentModel.DataAnnotations;
using Backend.Dtos.VehicleDtos;
using Backend.Models.enums;

namespace Backend.Dtos.TransporterDto
{
    public record GetTransporterDto
    {

        public int id { get; set; }

        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public EuropeanPhonePrefix InternationalPrefix { get; set; }

        public string PhoneNumber { get; set; } = string.Empty;

        public byte[] FileContentBase64 { get; set; } = Array.Empty<byte>();
        public TransporterType TransporterType { get; set; }
        public List<GetVehicleDto> AvailableVehicles { get; set; } = new List<GetVehicleDto>();


    }
}