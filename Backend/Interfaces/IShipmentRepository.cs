
using Backend.Dtos.Shipment;
using Backend.Dtos.TransporterDto;
using Backend.Dtos.UsersDto;
using Backend.Dtos.VehicleDtos;
using Backend.Models.classes;
using Backend.Models.classes.UsersEntities;

namespace Backend.Interfaces
{
    public interface IShipmentRepository
    {
        Task<ICollection<GetVehicleDto>?> GetAvailableVehicles(DateTime shipmentDate);
        Task<ICollection<GetTransporterDto>?> GetTransportersWithAvailableVehicles(DateTime shipmentDate);

        Task<Shipment?> GetShipmentById(int shipmentId);
        Task<GetShipmentDto?> GetShipmentDtoById(int shipmentId);
        Task<bool> ShipmentExists(int shipmentId);
        Task<List<Transporter>?> MatchTransporters(SearchUserCriteria criteria);

        Task<bool> CreateShipment(CreateShipmentDto shipment, int transporterId, int ownerId, int transporterVehicleId);
        Task<bool> NegociatePrice(int shipmentId, int newPrice);
        Task<bool> ModifyShipmentDate(int shipmentId, DateTime newDate);
        Task<bool> AcceptShipment(int shipmentId, int transporterId);
        Task<bool> CancelShipment(int shipmentId);
        Task<float> GetDistanceBetweenCities(string originCountry, string originCity, string destinationCountry, string destinationCity);
        Task<bool> Save();
    }
}