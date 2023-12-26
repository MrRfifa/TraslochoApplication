
using Backend.Models.classes;
using Backend.Models.enums;

namespace Backend.Dtos
{
    public struct SearchCriteria
    {
        public EUCountries Country { get; set; }
        public string City { get; set; }
        public VehicleType VehicleType { get; set; }
        public TransporterType TransporterType { get; set; }
    }
}