using AutoMapper;
<<<<<<< Updated upstream
using Backend.Dtos;
using Backend.Dtos.AddressDto;
using Backend.Dtos.Shipment;
using Backend.Dtos.TransporterDto;
using Backend.Dtos.VehicleDtos;
using Backend.Models.classes;
=======
using Backend.DTOs.Address;
using Backend.DTOs.Notification;
using Backend.DTOs.Request;
using Backend.DTOs.Review;
using Backend.DTOs.Shipment;
using Backend.DTOs.Vehicle;
using Backend.Models.Classes;
using Backend.Models.Classes.AddressesEntities;
using Backend.Models.Classes.UsersEntities;
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
=======

            CreateMap<Review, GetReviewDto>();
            CreateMap<CreateReviewDto, Review>();

            CreateMap<Request, GetRequestDto>();
            CreateMap<CreateRequestDto, Request>();

            CreateMap<Notification, GetNotificationDto>();
            CreateMap<CreateNotificationDto, Notification>();
>>>>>>> Stashed changes
        }
    }
}