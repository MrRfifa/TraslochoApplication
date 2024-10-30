using Backend.DTOs.Request;
using Backend.Models.Classes;

namespace Backend.Interfaces
{
    public interface IRequestRepository
    {
        Task<ICollection<GetRequestDto>?> GetAllRequests();
        Task<GetRequestDto?> GetRequestById(int requestId);
        Task<ICollection<GetRequestDto>?> GetRequestsByShipmentId(int shipmentId);
        Task<ICollection<GetRequestDto>?> GetRequestsByTransporterId(int transporterId);
        Task<Shipment?> GetShipmentByRequestId(int requestId);
        Task<int> GetTransporterIdByRequest(int requestId);
        Task<bool> RequestExists(int requestId);
        Task<bool> AcceptRequest(int requestId);
        Task<bool> CreateRequest(int transporterId, int shipmentId);
        Task<bool> DeleteRequest(int requestId);
        Task<bool> Save();
    }
}