
using Backend.Dtos.Shipment;
using Backend.Dtos.TransporterDto;
using Backend.Dtos.VehicleDtos;

namespace Backend.Interfaces
{
    public interface IShipmentRepository
    {
        Task<ICollection<GetVehicleDto>> GetAvailableVehicles(DateTime shipmentDate);
        Task<ICollection<GetTransporterDto>> GetTransportersWithAvailableVehicles(DateTime shipmentDate);
        Task<bool> CreateShipment(CreateShipmentDto shipment, int transporterId, int ownerId, int transporterVehicleId);
        Task<bool> Save();
    }
}