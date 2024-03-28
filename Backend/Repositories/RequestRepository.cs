
using AutoMapper;
using Backend.Data;
using Backend.Dtos.RequestDto;
using Backend.Interfaces;
using Backend.Models.classes;
using Backend.Models.enums;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class RequestRepository : IRequestRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IShipmentRepository _shipmentRepository;
        private readonly IVehicleRepository _vehicleRepository;
        private readonly IUserRepository _userRepository;

        public RequestRepository(DataContext context, IMapper mapper,
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
            // Mark requests as refused and accepted
            var requestToAccept = await GetRequestById(requestId);
            if (requestToAccept == null)
            {
                return false;
            }
            //TODO fix this accepted thing and fix the pricing
            requestToAccept.Status = RequestStatus.Accepted;

            var otherRequests = await _context.Requests
                                    .Where(r => r.ShipmentId == requestToAccept.ShipmentId && r.Id != requestId)
                                    .ToListAsync();
            foreach (var request in otherRequests)
            {
                request.Status = RequestStatus.Refused;
            }

            // Update the created shipment
            var shipmentToUpdate = await _shipmentRepository.GetShipmentById(requestToAccept.ShipmentId);
            if (shipmentToUpdate is null)
            {
                return false;
            }

            var transporter = await _userRepository.GetUserById(requestToAccept.TransporterId);
            if (transporter is null)
            {
                return false;
            }

            var transporterVehicle = await _vehicleRepository.GetVehicleByTransporterId(requestToAccept.TransporterId);
            if (transporterVehicle is null)
            {
                return false;
            }

            float distanceBetweenOriginUser = await _shipmentRepository.GetDistanceBetweenCities(
                nameof(transporter.UserAddress.Country),
                transporter.UserAddress.City,
                nameof(shipmentToUpdate.OriginAddress.Country),
                shipmentToUpdate?.OriginAddress?.City ?? "");

            shipmentToUpdate!.ShipmentStatus = ShipmentStatus.Accepted;
            shipmentToUpdate.TransporterId = requestToAccept.TransporterId;
            shipmentToUpdate.VehicleId = transporterVehicle.Id;

            TransporterShipment transporterShipment = new TransporterShipment
            {
                TransporterId = requestToAccept.TransporterId,
                ShipmentId = shipmentToUpdate.Id,
            };

            _context.TransporterShipments.Add(transporterShipment);
            return await Save();
        }

        public async Task<bool> CreateRequest(int transporterId, int shipmentId)
        {
            bool pendingShipment = await _context.Shipments
                .AnyAsync(s => s.Id == shipmentId && s.ShipmentStatus == ShipmentStatus.Pending);
            bool availableTransporter = await _vehicleRepository.TransporterHasAvailableVehicle(transporterId);

            if (!pendingShipment)
            {
                throw new ArgumentException("No pending shipments found.");
            }

            if (!availableTransporter)
            {
                throw new ArgumentException("No available vehicles for the transporter.");
            }

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
            if (await RequestExists(requestId))
            {
                var request = await _context.Requests.FindAsync(requestId);
                if (request != null)
                {
                    _context.Requests.Remove(request);
                    return await Save();
                }
                return false;
            }
            return false;
        }

        public async Task<ICollection<GetRequestDto>?> GetAllRequests()
        {
            var requests = await _context.Requests.OrderBy(r => r.Id).ToListAsync();
            var requestsDto = _mapper.Map<ICollection<GetRequestDto>>(requests);
            return requestsDto;
        }

        public async Task<GetRequestDto?> GetRequestById(int requestId)
        {
            if (await RequestExists(requestId))
            {
                var request = await _context.Requests.FirstOrDefaultAsync(r => r.Id == requestId);
                return _mapper.Map<GetRequestDto>(request);
            }
            return null;
        }

        public async Task<ICollection<GetRequestDto>?> GetRequestsByShipmentId(int shipmentId)
        {
            var shipmentExists = await _context.Shipments.AnyAsync(t => t.Id == shipmentId);

            if (shipmentExists)
            {
                var shipmentRequests = await _context.Requests
                    .Where(r => r.ShipmentId == shipmentId)
                    .ToListAsync();

                if (shipmentRequests.Any())
                {
                    return _mapper.Map<ICollection<GetRequestDto>>(shipmentRequests);
                }
                else
                {
                    return Enumerable.Empty<GetRequestDto>().ToList();
                }
            }
            else
            {
                return null;
            }
        }

        public async Task<ICollection<GetRequestDto>?> GetRequestsByTransporterId(int transporterId)
        {
            var transporterExists = await _context.Transporters.AnyAsync(t => t.Id == transporterId);

            if (transporterExists)
            {
                var transporterRequests = await _context.Requests
                    .Where(r => r.TransporterId == transporterId)
                    .ToListAsync();

                if (transporterRequests.Any())
                {
                    return _mapper.Map<ICollection<GetRequestDto>>(transporterRequests);
                }
                else
                {
                    return Enumerable.Empty<GetRequestDto>().ToList();
                }
            }
            else
            {
                return null;
            }
        }

        public async Task<bool> RequestExists(int requestId)
        {
            return await _context.Requests.AnyAsync(e => e.Id == requestId);
        }

        public async Task<bool> Save()
        {
            var saved = await _context.SaveChangesAsync();
            return saved > 0;
        }
    }
}