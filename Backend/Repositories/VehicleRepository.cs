
using AutoMapper;
using Backend.Data;
using Backend.Dtos;
using Backend.Dtos.Vehicle;
using Backend.Interfaces;
using Backend.Models.classes;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class VehicleRepository : IVehicleRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public VehicleRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<bool> CreateVehicle(VehicleDto vehicleDto, int transporterId)
        {
            // Map the DTO to the entity
            var vehicleEntity = _mapper.Map<Vehicle>(vehicleDto);

            // Process the vehicle images
            var vehicleImages = new List<VehicleImage>();

            foreach (var formFile in vehicleDto.VehicleImages)
            {
                // Read the stream directly from the form file
                using (var stream = formFile.OpenReadStream())
                {
                    // Convert the image to a byte array
                    using (var ms = new MemoryStream())
                    {
                        await stream.CopyToAsync(ms);
                        byte[] bytes = ms.ToArray();

                        var vehicleImage = new VehicleImage
                        {
                            FileName = formFile.FileName,
                            UploadDate = DateTime.Now,
                            FileContentBase64 = bytes,
                        };

                        vehicleImages.Add(vehicleImage);
                    }
                }
            }

            Vehicle vehicle = new Vehicle
            {
                Manufacture = vehicleEntity.Manufacture,
                Model = vehicleEntity.Model,
                Year = vehicleEntity.Year,
                Color = vehicleEntity.Color,
                VehicleType = vehicleEntity.VehicleType,
                Length = vehicleEntity.Length,
                Height = vehicleEntity.Height,
                VehicleImages = vehicleImages,
                IsAvailable = true,
                TransporterId = transporterId,
            };

            // Add the vehicle entity to the context
            await _context.Vehicles.AddAsync(vehicle);

            // Save changes to the database
            return await Save();
        }

        public async Task<bool> DeleteVehicle(int vehicleId)
        {
            var vehicle = GetVehicleById(vehicleId);
            _context.Remove(vehicle);
            return await Save();
        }

        public async Task<Vehicle> GetVehicleById(int vehicleId)
        {
            var vehicle = await _context.Vehicles
                            .Include(v => v.VehicleImages)
                            .FirstOrDefaultAsync(v => v.Id == vehicleId);
            if (vehicle is null)
            {
                throw new Exception("Vehicle to delete not found");
            }
            return vehicle;
        }

        public async Task<ICollection<GetVehicleDto>> GetVehicles()
        {
            var vehicles = await _context.Vehicles
                .Include(v => v.VehicleImages)
                .OrderBy(v => v.Id)
                .ToListAsync();

            var vehicleDtos = _mapper.Map<ICollection<GetVehicleDto>>(vehicles);
            return vehicleDtos;
        }

        public async Task<ICollection<Vehicle>> GetVehiclesByTransporterId(int transporterId)
        {
            var transporterExists = await _context.Transporters.AnyAsync(v => v.Id == transporterId);

            if (!transporterExists)
            {
                throw new Exception("Transporter not found");
            }

            var transporterVehicles = await _context.Vehicles
                                .Include(v => v.VehicleImages)
                                .Where(v => v.TransporterId == transporterId)
                                .ToListAsync();
            return transporterVehicles;
        }

        public async Task<bool> Save()
        {
            var saved = await _context.SaveChangesAsync();
            return saved > 0;
        }

        public async Task<bool> VehicleExists(int vehicleId)
        {
            return await _context.Vehicles.AnyAsync(e => e.Id == vehicleId);
        }
    }
}