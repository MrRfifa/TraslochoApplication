using Backend.DTOs.Address;
using Backend.DTOs.Shipment;
using Backend.Models.Classes;

namespace Backend.Interfaces
{
    public interface IShipmentRepository
    {
        //TODO add an update addresses method
        Task<Shipment?> GetShipmentById(int shipmentId);
        Task<ICollection<Shipment>?> GetShipmentsByOwnerId(int ownerId);
        Task<GetShipmentDto?> GetShipmentDtoById(int shipmentId);
        Task<bool> ShipmentExists(int shipmentId);
        Task<bool> CreateShipment(CreateShipmentDto shipment, int ownerId);
        Task<int> AddShipmentAddresses(int shipmentId, CreateAddressDto originAddress, CreateAddressDto destinationAddress);
        Task<int> ModifyShipmentDate(int shipmentId, DateTime newDate);
        Task<int> CancelShipment(int shipmentId);
        Task<float> GetDistanceBetweenCities(string originCountry, string originCity, string destinationCountry, string destinationCity);
        Task<bool> Save();
    }
}