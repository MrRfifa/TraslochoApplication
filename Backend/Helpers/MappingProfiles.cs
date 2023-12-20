using AutoMapper;
using Backend.Dtos;
using Backend.Dtos.Vehicle;
using Backend.Models.classes;

namespace Backend.Helpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Vehicle, GetVehicleDto>();
            CreateMap<VehicleDto, Vehicle>()
            .ForMember(dest => dest.VehicleImages, opt => opt.Ignore());
        }

    }
}