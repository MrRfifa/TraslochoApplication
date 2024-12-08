
using AutoMapper;
using Backend.DTOs.Address;
using Backend.DTOs.Notification;
using Backend.DTOs.Request;
using Backend.DTOs.Review;
using Backend.DTOs.Shipment;
using Backend.DTOs.User;
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
            CreateMap<UserAddress, GetAddressDto>();

            CreateMap<Review, GetReviewDto>();
            CreateMap<CreateReviewDto, Review>();

            CreateMap<Request, GetRequestDto>()
                .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.Transporter!.FirstName))
                .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.Transporter!.LastName));
            CreateMap<CreateRequestDto, Request>();

            CreateMap<Notification, GetNotificationDto>();
            CreateMap<CreateNotificationDto, Notification>();

            // Map Transporter to TransporterDto
            CreateMap<Transporter, GetTransporterInfoDto>()
                .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.FirstName))
                .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.LastName))
                .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => src.DateOfBirth))
                .ForMember(dest => dest.UserAddress, opt => opt.MapFrom(src => src.UserAddress))
                .ForMember(dest => dest.TransporterType, opt => opt.MapFrom(src => src.TransporterType))
                .ForMember(dest => dest.Vehicle, opt => opt.MapFrom(src => src.Vehicle))
                .ForMember(dest => dest.FileContentBase64, opt => opt.MapFrom(src => src.FileContentBase64))
                .ForMember(dest => dest.TransporterReviews, opt => opt.MapFrom(src => src.TransporterReviews));
        }
    }
}