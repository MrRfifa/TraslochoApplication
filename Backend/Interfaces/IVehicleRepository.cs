using Backend.Dtos.VehicleDtos;
using Backend.Models.classes;

namespace Backend.Interfaces
{
    public interface IVehicleRepository
    {
        Task<ICollection<GetVehicleDto>?> GetVehicles();
        Task<Vehicle?> GetVehicleById(int vehicleId);
        Task<ICollection<Vehicle>?> GetVehiclesByTransporterId(int transporterId);
        Task<bool> VehicleExists(int vehicleId);
        Task<bool> CreateVehicle(CreateVehicleDto vehicle, int transporterId);
        Task<bool> DeleteVehicle(int vehicleId);
        Task<bool> Save();
    }
}