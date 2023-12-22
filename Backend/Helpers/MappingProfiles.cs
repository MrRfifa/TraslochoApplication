using AutoMapper;
using Backend.Dtos;
using Backend.Dtos.AddressDto;
using Backend.Dtos.Shipment;
using Backend.Dtos.TransporterDto;
using Backend.Dtos.VehicleDtos;
using Backend.Models.classes;

namespace Backend.Helpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Vehicle, GetVehicleDto>();
            CreateMap<CreateVehicleDto, Vehicle>()
            .ForMember(dest => dest.VehicleImages, opt => opt.Ignore());
            CreateMap<Transporter, GetTransporterDto>();
            CreateMap<CreateShipmentDto, Shipment>();
            CreateMap<Shipment, GetShipmentDto>();

            CreateMap<CreateAddressDto, Address>();
        }
    }
}