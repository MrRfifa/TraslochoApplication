using Backend.Dtos.VehicleDtos;
using Backend.Models.classes;

namespace Backend.Interfaces
{
    public interface IVehicleRepository
    {
        Task<ICollection<GetVehicleDto>?> GetVehicles();
        Task<Vehicle?> GetVehicleById(int vehicleId);
        Task<Vehicle?> GetVehicleByTransporterId(int transporterId);
        Task<bool> VehicleExists(int vehicleId);
        Task<bool> TransporterHasAvailableVehicle(int transporterId);
        Task<bool> CreateVehicle(CreateVehicleDto vehicle, int transporterId);
        Task<bool> UpdateVehicle(int vehicleId, UpdateVehicleDto vehicleDto);
        Task<bool> UpdateVehicleImages(int vehicleId, UpdateVehicleImagesDto vehicleImagesDto);
        Task<bool> MarkVehicleAsUnavailable(int vehicleId);
        Task<bool> MarkVehicleAsAvailable(int vehicleId);
        Task<bool> Save();
    }
}