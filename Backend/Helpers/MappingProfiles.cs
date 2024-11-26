
using AutoMapper;
using Backend.DTOs.Address;
using Backend.DTOs.Notification;
using Backend.DTOs.Request;
using Backend.DTOs.Review;
using Backend.DTOs.Shipment;
using Backend.DTOs.Vehicle;
using Backend.Models.Classes;
using Backend.Models.Classes.AddressesEntities;
using Backend.Models.Classes.UsersEntities;

namespace Backend.Helpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Vehicle, GetVehicleDto>();
            CreateMap<CreateVehicleDto, Vehicle>()
            .ForMember(dest => dest.VehicleImages, opt => opt.Ignore());
            CreateMap<CreateShipmentDto, Shipment>()
            .ForMember(dest => dest.Images, opt => opt.Ignore());

            CreateMap<Shipment, GetShipmentDto>();

            CreateMap<CreateAddressDto, ShipmentAddress>();
            CreateMap<ShipmentAddress, GetAddressDto>();
            CreateMap<CreateAddressDto, UserAddress>();

            CreateMap<Review, GetReviewDto>();
            CreateMap<CreateReviewDto, Review>();

            CreateMap<Request, GetRequestDto>()
                .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.Transporter!.FirstName))
                .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.Transporter!.LastName));
            CreateMap<CreateRequestDto, Request>();

            CreateMap<Notification, GetNotificationDto>();
            CreateMap<CreateNotificationDto, Notification>();
        }
    }
}