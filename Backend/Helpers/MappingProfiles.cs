using AutoMapper;
using Backend.Dtos.AddressDto;
using Backend.Dtos.Shipment;
using Backend.Dtos.TransporterDto;
using Backend.Dtos.VehicleDtos;
using Backend.Models.classes;
using Backend.Models.classes.UsersEntities;

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
            CreateMap<CreateShipmentDto, Shipment>()
            .ForMember(dest => dest.Images, opt => opt.Ignore());

            CreateMap<Shipment, GetShipmentDto>();

            CreateMap<CreateAddressDto, ShipmentAddress>();
            CreateMap<CreateAddressDto, UserAddress>();
        }
    }
}