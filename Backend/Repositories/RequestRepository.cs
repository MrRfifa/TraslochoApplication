using AutoMapper;
using Backend.Data;
using Backend.DTOs.Notification;
using Backend.DTOs.Request;
using Backend.DTOs.Shipment;
using Backend.Interfaces;
using Backend.Models.Classes;
using Backend.Models.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using StackExchange.Redis;

namespace Backend.Repositories
{
    public class RequestRepository : IRequestRepository
    {
        private readonly ApplicationDBContext _context;
        private readonly IMapper _mapper;
        private readonly IShipmentRepository _shipmentRepository;
        private readonly IVehicleRepository _vehicleRepository;
        private readonly IUserRepository _userRepository;
        private readonly INotificationRepository _notificationRepository;
        private readonly IConnectionMultiplexer _redis;

        public RequestRepository(ApplicationDBContext context, IMapper mapper,
                                 IShipmentRepository shipmentRepository,
                                 IVehicleRepository vehicleRepository,
                                 IUserRepository userRepository,
                                 INotificationRepository notificationRepository,
                                 IConnectionMultiplexer connectionMultiplexer)
        {
            _shipmentRepository = shipmentRepository;
            _vehicleRepository = vehicleRepository;
            _userRepository = userRepository;
            _context = context;
            _mapper = mapper;
            _notificationRepository = notificationRepository;
            _redis = connectionMultiplexer;
        }

        public async Task<bool> AcceptRequest(int requestId)
        {
            var requestToAccept = await _context.Requests
                .FirstOrDefaultAsync(r => r.RequestId == requestId);
            if (requestToAccept == null)
            {
                throw new ArgumentException("Request not found.");
            }
            // Set the accepted request status
            requestToAccept.Status = RequestStatus.Accepted;
            //Notify the chosen transporter 
            int transporterId = await GetTransporterIdByRequest(requestToAccept.RequestId);
            var db = _redis.GetDatabase();
            var transporterConnectionId = await db.StringGetAsync($"{transporterId}-connection");
            await NotifyUser(transporterId, transporterConnectionId, "Your request for a shipment has been approved.");
            // Update the associated shipment
            var shipmentToUpdate = await _shipmentRepository.GetShipmentById(requestToAccept.ShipmentId);
            if (shipmentToUpdate == null)
            {
                throw new ArgumentException("Shipment not found.");
            }

            var transporter = await _userRepository.GetUserById(requestToAccept.TransporterId);
            if (transporter == null)
            {
                throw new ArgumentException("Transporter not found.");
            }

            var transporterVehicle = await _vehicleRepository.GetVehicleByTransporterId(requestToAccept.TransporterId);
            if (transporterVehicle == null)
            {
                throw new ArgumentException("Vehicle not found.");
            }
            // Refuse other requests for the same shipment
            var otherRequests = await _context.Requests
                .Where(r => r.ShipmentId == requestToAccept.ShipmentId && r.RequestId != requestId)
                .ToListAsync();

            // Calculate distance
            float distanceBetweenOriginUser = await _shipmentRepository.GetDistanceBetweenCities(
                nameof(transporter.UserAddress.Country),
                transporter.UserAddress.City,
                nameof(shipmentToUpdate.OriginAddress.Country),
                shipmentToUpdate.OriginAddress?.City ?? "");

            // Update shipment details
            shipmentToUpdate.ShipmentStatus = ShipmentStatus.Accepted;
            shipmentToUpdate.TransporterId = requestToAccept.TransporterId;
            shipmentToUpdate.DistanceBetweenAddresses += distanceBetweenOriginUser;
            shipmentToUpdate.Price += 6 * (int)distanceBetweenOriginUser;

            // Save changes to the database
            _context.Requests.Update(requestToAccept); // Update the accepted request
            _context.Requests.UpdateRange(otherRequests); // Update refused requests
            _context.Shipments.Update(shipmentToUpdate); // Update the shipment
            var requestUpdates = await Save();
            // return await Save();
            if (requestUpdates)
            {
                try
                {
                    foreach (var request in otherRequests)
                    {
                        request.Status = RequestStatus.Refused;
                        //Notify the refused transporter 
                        int refusedTransporterId = await GetTransporterIdByRequest(request.RequestId);
                        // var db = _redis.GetDatabase();
                        var refusedTransporterConnectionId = await db.StringGetAsync($"{refusedTransporterId}-connection");
                        await NotifyUser(refusedTransporterId, refusedTransporterConnectionId, "Your request for a shipment has been refused.");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Notification error: {ex.Message}");
                    // Log or handle notification failure separately if desired
                }

            }
            return requestUpdates;
        }
        public async Task<bool> CreateRequest(int transporterId, int shipmentId)
        {
            // Fetch the shipment details
            GetShipmentDto? shipmentToBeRequested = await _shipmentRepository.GetShipmentDtoById(shipmentId);

            // Check if the shipment exists
            if (shipmentToBeRequested == null)
            {
                throw new ArgumentException("Shipment not found.");
            }

            // Check if the shipment is pending
            if (shipmentToBeRequested.ShipmentStatus != ShipmentStatus.Pending)
            {
                throw new ArgumentException("No pending shipments found.");
            }

            // Check if the transporter has an available vehicle
            bool availableVehicle = await _vehicleRepository.TransporterHasAvailableVehicle(transporterId);
            if (!availableVehicle)
            {
                throw new ArgumentException("No available vehicles for the transporter.");
            }

            // Check if the transporter already has a shipment on the requested date
            bool availableTransporter = await _vehicleRepository.TransporterHasShipmentOnDate(transporterId, shipmentToBeRequested.ShipmentDate);
            if (availableTransporter)
            {
                throw new ArgumentException("The transporter already has a shipment scheduled for that day.");
            }

            // Create the request
            Request request = new Request
            {
                ShipmentId = shipmentId,
                TransporterId = transporterId,
                Status = RequestStatus.Pending
            };
            var shipment = await _context.Shipments.FirstOrDefaultAsync(r => r.Id == shipmentId);
            int ownerId = shipment!.OwnerId;
            var db = _redis.GetDatabase();
            var ownerConnectionId = await db.StringGetAsync($"{ownerId}-connection");
            await NotifyUser(ownerId, ownerConnectionId, "New request has been created.");
            await _context.Requests.AddAsync(request);
            return await Save();
        }
        public async Task<bool> DeleteRequest(int requestId)
        {
            // Fetch the request
            var request = await _context.Requests.FindAsync(requestId);
            if (request is not null)
            {
                // Check if the request is pending
                if (request.Status == RequestStatus.Pending)
                {
                    // Remove the request if it is pending
                    _context.Requests.Remove(request);
                    return await Save();
                }
                throw new InvalidOperationException("Request is no longer removable! Only pending requests can be deleted.");
            }
            return false;
        }
        public async Task<ICollection<GetRequestDto>?> GetAllRequests()
        {
            var requests = await _context.Requests
                .OrderBy(r => r.RequestId)
                .ToListAsync();

            return _mapper.Map<ICollection<GetRequestDto>>(requests);
        }
        public async Task<GetRequestDto?> GetRequestById(int requestId)
        {
            if (!await RequestExists(requestId))
            {
                return null; // Return null if the request doesn't exist
            }

            var request = await _context.Requests
                .FirstOrDefaultAsync(r => r.RequestId == requestId);

            return _mapper.Map<GetRequestDto>(request);
        }
        public async Task<ICollection<GetRequestDto>?> GetRequestsByShipmentId(int shipmentId)
        {
            var shipmentExists = await _context.Shipments.AnyAsync(s => s.Id == shipmentId);

            if (!shipmentExists)
            {
                return null; // Return null if the shipment doesn't exist
            }

            var shipmentRequests = await _context.Requests
                .Include(r => r.Transporter)
                .Where(r => r.ShipmentId == shipmentId)
                .ToListAsync();

            return shipmentRequests.Any()
                ? _mapper.Map<ICollection<GetRequestDto>>(shipmentRequests)
                : Enumerable.Empty<GetRequestDto>().ToList();
        }
        public async Task<ICollection<GetRequestDto>?> GetRequestsByTransporterId(int transporterId)
        {
            var transporterExists = await _context.Transporters.AnyAsync(t => t.Id == transporterId);

            if (!transporterExists)
            {
                return null; // Return null if the transporter doesn't exist
            }

            var transporterRequests = await _context.Requests
                .Where(r => r.TransporterId == transporterId)
                .ToListAsync();

            return transporterRequests.Any()
                ? _mapper.Map<ICollection<GetRequestDto>>(transporterRequests)
                : Enumerable.Empty<GetRequestDto>().ToList();
        }
        public async Task<Shipment?> GetShipmentByRequestId(int requestId)
        {
            var request = await _context.Requests
                .Include(r => r.Shipment) // Include the associated Shipment entity
                .FirstOrDefaultAsync(r => r.RequestId == requestId);
            if (request != null)
            {
                return request.Shipment;
            }
            return null;
        }
        public async Task<int> GetTransporterIdByRequest(int requestId)
        {
            var request = await _context.Requests.FirstOrDefaultAsync(r => r.RequestId == requestId);
            return request!.TransporterId;
        }
        public async Task<bool> RequestExists(int requestId)
        {
            return await _context.Requests.AnyAsync(e => e.RequestId == requestId);
        }
        public async Task<bool> Save()
        {
            var saved = await _context.SaveChangesAsync();
            return saved > 0;
        }

        // Helper method for notification
        private async Task NotifyUser(int userId, string? connectionId, string content)
        {
            if (!string.IsNullOrEmpty(connectionId))
            {
                var sendNotificationDto = new SendNotificationDto
                {
                    UserId = userId,
                    Content = content,
                    ConnectionId = connectionId
                };
                await _notificationRepository.SendNotification(sendNotificationDto);
            }
            else
            {
                // ConnectionId is not present, save the notification to the database
                var notificationToStore = new CreateNotificationDto
                {
                    UserId = userId,
                    Content = content,
                };
                await _notificationRepository.AddNotification(notificationToStore);
            }
        }

    }
}