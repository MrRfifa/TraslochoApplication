using AutoMapper;
using Backend.Data;
using Backend.DTOs.Request;
using Backend.DTOs.Shipment;
using Backend.Interfaces;
using Backend.Models.Classes;
using Backend.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class RequestRepository : IRequestRepository
    {
        private readonly ApplicationDBContext _context;
        private readonly IMapper _mapper;
        private readonly IShipmentRepository _shipmentRepository;
        private readonly IVehicleRepository _vehicleRepository;
        private readonly IUserRepository _userRepository;

        public RequestRepository(ApplicationDBContext context, IMapper mapper,
                                 IShipmentRepository shipmentRepository,
                                 IVehicleRepository vehicleRepository,
                                 IUserRepository userRepository)
        {
            _shipmentRepository = shipmentRepository;
            _vehicleRepository = vehicleRepository;
            _userRepository = userRepository;
            _context = context;
            _mapper = mapper;
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

            foreach (var request in otherRequests)
            {
                request.Status = RequestStatus.Refused;
            }
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
            return await Save();
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
        public async Task<bool> RequestExists(int requestId)
        {
            return await _context.Requests.AnyAsync(e => e.RequestId == requestId);
        }
        public async Task<bool> Save()
        {
            var saved = await _context.SaveChangesAsync();
            return saved > 0;
        }
    }
}