using Backend.DTOs.Vehicle;
using Backend.Models.Classes;

namespace Backend.Interfaces
{
    public interface IVehicleRepository
    {
        Task<ICollection<GetVehicleDto>?> GetVehicles();
        Task<Vehicle?> GetVehicleById(int vehicleId);
        Task<GetVehicleDto?> GetVehicleByTransporterId(int transporterId);
        Task<bool> VehicleExists(int vehicleId);
        Task<bool> TransporterHasAvailableVehicle(int transporterId);
        Task<bool> TransporterHasShipmentOnDate(int transporterId, DateTime date);
        Task<bool> CreateVehicle(CreateVehicleDto vehicleDto, int transporterId);
        Task<bool> UpdateVehicle(int vehicleId, UpdateVehicleDto vehicleDto);
        Task<bool> UpdateVehicleImages(int vehicleId, UpdateVehicleImagesDto vehicleImagesDto);
        Task<bool> MarkVehicleAsUnavailable(int vehicleId);
        Task<bool> MarkVehicleAsAvailable(int vehicleId);
        Task<bool> VehicleIsAvailable(int vehicleId);
        Task<bool> Save();
    }
}