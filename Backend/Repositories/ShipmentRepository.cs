using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Backend.Data;
using Backend.Dtos.Shipment;
using Backend.Dtos.TransporterDto;
using Backend.Dtos.VehicleDtos;
using Backend.Interfaces;
using Backend.Models.classes;
using Backend.Models.enums;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class ShipmentRepository : IShipmentRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public ShipmentRepository(IMapper mapper, DataContext context)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<bool> CreateShipment(CreateShipmentDto shipmentToCreate, int transporterId, int ownerId, int transporterVehicleId)
        {
            try
            {
                // Map shipment DTO to entity
                var shipmentEntity = _mapper.Map<Shipment>(shipmentToCreate);

                shipmentEntity.OwnerId = ownerId;
                shipmentEntity.TransporterId = transporterId;
                shipmentEntity.ShipmentStatus = ShipmentStatus.Pending;
                shipmentEntity.VehicleId = transporterVehicleId;

                _context.Add(shipmentEntity);
                await Save();

                TransporterShipment transporterShipment = new TransporterShipment
                {
                    TransporterId = transporterId,
                    ShipmentId = shipmentEntity.Id,
                    VehicleId = transporterVehicleId
                };

                OwnerShipment ownerShipment = new OwnerShipment
                {
                    OwnerId = ownerId,
                    ShipmentId = shipmentEntity.Id,
                    VehicleId = transporterVehicleId
                };

                _context.Add(transporterShipment);
                _context.Add(ownerShipment);

                // Ensure that SaveChangesAsync is used for asynchronous operations
                return await Save();
            }
            catch (Exception ex)
            {
                // Log the exception details
                // You might want to log or handle the exception appropriately
                throw new Exception(ex.Message);
            }
        }



        public async Task<ICollection<GetVehicleDto>> GetAvailableVehicles(DateTime shipmentDate)
        {
            var availableVehicles = await _context.Vehicles
                .Include(v => v.VehicleImages)
                .Where(v => v.IsAvailable && !v.TransporterShipments!.Any(ts => ts.Shipment!.ShipmentDate == shipmentDate))
                .OrderBy(v => v.Id)
                .ToListAsync();

            var availableVehiclesDto = _mapper.Map<ICollection<GetVehicleDto>>(availableVehicles);

            return availableVehiclesDto;
        }




        public async Task<ICollection<GetTransporterDto>> GetTransportersWithAvailableVehicles(DateTime shipmentDate)
        {
            var transportersWithAvailableVehicles = await _context.Transporters
                .Include(t => t.Vehicles)
                .Where(t => t.Vehicles!.Any(v => v.IsAvailable && !v.TransporterShipments!.Any(ts => ts.Shipment!.ShipmentDate == shipmentDate)))
                .OrderBy(t => t.Id)
                .ToListAsync();

            var transportersWithAvailableVehiclesDto = transportersWithAvailableVehicles
                .Select(t =>
                {
                    var transporterDto = _mapper.Map<GetTransporterDto>(t);

                    // Load related entities for each vehicle before applying ToList
                    transporterDto.AvailableVehicles = t.Vehicles!
                        .Where(v => v.IsAvailable && !v.TransporterShipments!.Any(ts => ts.Shipment!.ShipmentDate == shipmentDate))
                        .Select(v =>
                        {
                            var vehicleDto = _mapper.Map<GetVehicleDto>(v);
                            vehicleDto.VehicleImages = _mapper.Map<List<VehicleImage>>(v.VehicleImages);
                            // Map other properties as needed
                            return vehicleDto;
                        })
                        .ToList();

                    return transporterDto;
                })
                .ToList();

            return transportersWithAvailableVehiclesDto;
        }

        public async Task<bool> Save()
        {
            var saved = await _context.SaveChangesAsync();
            return saved > 0;
        }
    }
}