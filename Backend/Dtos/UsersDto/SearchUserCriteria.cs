
using Backend.Models.enums;

namespace Backend.Dtos.UsersDto
{
    public struct SearchUserCriteria
    {
        public EUCountries Country { get; set; }
        public string City { get; set; }
        public VehicleType VehicleType { get; set; }
        public TransporterType TransporterType { get; set; }
    }
}