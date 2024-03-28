using Backend.Dtos.RequestDto;

namespace Backend.Interfaces
{
    //TODO Review this interface: add acceptRequest method
    public interface IRequestRepository
    {
        Task<ICollection<GetRequestDto>?> GetAllRequests();
        Task<GetRequestDto?> GetRequestById(int requestId);
        Task<ICollection<GetRequestDto>?> GetRequestsByShipmentId(int shipmentId);
        Task<ICollection<GetRequestDto>?> GetRequestsByTransporterId(int transporterId);
        Task<bool> RequestExists(int requestId);
        Task<bool> AcceptRequest(int requestId);
        Task<bool> CreateRequest(int transporterId, int shipmentId);
        // Task<bool> UpdateRequest(int requestId, CreateRequestDto reviewDto);
        Task<bool> DeleteRequest(int requestId);
        Task<bool> Save();
    }
}