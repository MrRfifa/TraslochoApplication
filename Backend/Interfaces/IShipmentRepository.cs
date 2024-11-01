using Backend.DTOs.Address;
using Backend.DTOs.Shipment;
using Backend.Models.Classes;

namespace Backend.Interfaces
{
    public interface IShipmentRepository
    {
        Task<Shipment?> GetShipmentById(int shipmentId);
        Task<ICollection<Shipment>?> GetCompletedShipmentsByOwnerId(int ownerId);
        Task<ICollection<Shipment>?> GetCanceledShipmentsByOwnerId(int ownerId);
        Task<ICollection<Shipment>?> GetPendingShipmentsByOwnerId(int ownerId);
        Task<ICollection<Shipment>?> GetAcceptedShipmentsByOwnerId(int ownerId);
        Task<GetShipmentDto?> GetShipmentDtoById(int shipmentId);
        Task<bool> ShipmentExists(int shipmentId);
        Task<bool> CreateShipment(CreateShipmentDto shipment, int ownerId);
        Task<int> AddShipmentAddresses(int shipmentId, CreateAddressDto originAddress, CreateAddressDto destinationAddress);
        Task<int> ModifyShipmentDate(int shipmentId, DateTime newDate);
        Task<int> CancelShipment(int shipmentId);
        Task<int> MarkShipmentAsCompleted(int shipmentId);
        Task<float> GetDistanceBetweenCities(string originCountry, string originCity, string destinationCountry, string destinationCity);
        Task<bool> Save();
    }
}