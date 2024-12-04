
using Backend.DTOs.Request;
using Backend.Interfaces;
using Backend.Models.Classes;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;

namespace Backend.Cached
{
    public class CachedRequestRepository : IRequestRepository
    {
        private readonly IShipmentRepository _shipmentRepository;
        private readonly IRequestRepository _decorated;
        private readonly IDistributedCache _distributedCache;
        public CachedRequestRepository(IShipmentRepository shipmentRepository, IDistributedCache distributedCache, IRequestRepository requestRepository)
        {
            _decorated = requestRepository;
            _distributedCache = distributedCache;
            _shipmentRepository = shipmentRepository;
        }
        public async Task<bool> AcceptRequest(int requestId)
        {
            // Call the decorated method to accept the request
            bool isAccepted = await _decorated.AcceptRequest(requestId);

            if (isAccepted)
            {
                // Fetch the shipment that was accepted through the request
                var acceptedShipment = await _decorated.GetShipmentByRequestId(requestId);
                if (acceptedShipment != null)
                {
                    // Define the cache keys
                    var pendingShipmentsKey = $"owner-pending-shipments-{acceptedShipment.OwnerId}";
                    var acceptedShipmentsKey = $"owner-accepted-shipments-{acceptedShipment.OwnerId}";

                    // Remove the cached pending and accepted shipments
                    await _distributedCache.RemoveAsync(pendingShipmentsKey);
                    await _distributedCache.RemoveAsync(acceptedShipmentsKey);

                    // Fetch the updated pending and accepted shipments from the decorated repository
                    var pendingShipments = await _shipmentRepository.GetPendingCompletedDataShipmentsByUserId(acceptedShipment.OwnerId);
                    var acceptedShipments = await _shipmentRepository.GetAcceptedShipmentsByUserId(acceptedShipment.OwnerId);

                    // Re-cache the updated pending shipments if there are any
                    if (pendingShipments != null && pendingShipments.Any())
                    {
                        await _distributedCache.SetStringAsync(pendingShipmentsKey, JsonConvert.SerializeObject(pendingShipments), new DistributedCacheEntryOptions
                        {
                            AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1)
                        });
                    }

                    // Re-cache the updated accepted shipments if there are any
                    if (acceptedShipments != null && acceptedShipments.Any())
                    {
                        await _distributedCache.SetStringAsync(acceptedShipmentsKey, JsonConvert.SerializeObject(acceptedShipments), new DistributedCacheEntryOptions
                        {
                            AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1)
                        });
                    }
                }
            }

            return isAccepted;
        }
        public async Task<bool> CreateRequest(int transporterId, int shipmentId)
        {
            return await _decorated.CreateRequest(transporterId, shipmentId);
        }
        public async Task<bool> DeleteRequest(int requestId)
        {
            return await _decorated.DeleteRequest(requestId);
        }
        public async Task<ICollection<GetRequestDto>?> GetAllRequests()
        {
            return await _decorated.GetAllRequests();
        }
        public async Task<GetRequestDto?> GetRequestById(int requestId)
        {
            return await _decorated.GetRequestById(requestId);
        }

        public async Task<GetRequestDto?> GetRequestByTransporterAndShipment(int transporterId, int shipmentId)
        {
            return await _decorated.GetRequestByTransporterAndShipment(transporterId, shipmentId);
        }

        public async Task<ICollection<GetRequestDto>?> GetRequestsByShipmentId(int shipmentId)
        {
            return await _decorated.GetRequestsByShipmentId(shipmentId);
        }
        public async Task<ICollection<GetRequestDto>?> GetRequestsByTransporterId(int transporterId)
        {
            return await _decorated.GetRequestsByTransporterId(transporterId);
        }
        public async Task<Shipment?> GetShipmentByRequestId(int requestId)
        {
            return await _decorated.GetShipmentByRequestId(requestId);
        }
        public async Task<int> GetTransporterIdByRequest(int requestId)
        {
            return await _decorated.GetTransporterIdByRequest(requestId);
        }
        public async Task<bool> RequestExists(int requestId)
        {
            return await _decorated.RequestExists(requestId);
        }
        public async Task<bool> Save()
        {
            return await _decorated.Save();
        }

        public async Task<bool> TransporterHasRequestForShipment(int transporterId, int shipmentId)
        {
            return await _decorated.TransporterHasRequestForShipment(transporterId, shipmentId);
        }
    }
}