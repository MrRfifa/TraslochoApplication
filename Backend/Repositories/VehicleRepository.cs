
using AutoMapper;
using Backend.Data;
using Backend.DTOs.Vehicle;
using Backend.Interfaces;
using Backend.Models.Classes;
using Backend.Models.Classes.ImagesEntities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class VehicleRepository : IVehicleRepository
    {
        private readonly ApplicationDBContext _context;
        private readonly IMapper _mapper;

        public VehicleRepository(ApplicationDBContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }
        public async Task<bool> CreateVehicle(CreateVehicleDto vehicleDto, int transporterId)
        {
            try
            {
                bool transporterHasVehicle = _context.Vehicles.Any(v => v.TransporterId == transporterId);
                if (transporterHasVehicle)
                {
                    return false;
                }
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

                await _context.Vehicles.AddAsync(vehicle);
                // return await Save();
                await _context.SaveChangesAsync(); // Assuming SaveChangesAsync is used here
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to create vehicle.", ex);
            }
        }

        public async Task<Vehicle?> GetVehicleById(int vehicleId)
        {
            var vehicle = await _context.Vehicles
                            .Include(v => v.VehicleImages)
                            .FirstOrDefaultAsync(v => v.Id == vehicleId);
            if (vehicle is null)
            {
                return null;
            }
            return vehicle;
        }

        public async Task<GetVehicleDto?> GetVehicleByTransporterId(int transporterId)
        {
            var transporterVehicle = await _context.Vehicles
                                        .Include(v => v.VehicleImages)
                                        .FirstOrDefaultAsync(v => v.TransporterId == transporterId);

            if (transporterVehicle is null)
            {
                return null;
            }

            var vehicleEntity = _mapper.Map<GetVehicleDto>(transporterVehicle);
            return vehicleEntity;
        }

        public async Task<ICollection<GetVehicleDto>?> GetVehicles()
        {
            var vehicles = await _context.Vehicles
               .Include(v => v.VehicleImages)
               .OrderBy(v => v.Id)
               .ToListAsync();

            var vehicleDtos = _mapper.Map<ICollection<GetVehicleDto>>(vehicles);
            return vehicleDtos;
        }

        public async Task<bool> VehicleIsAvailable(int vehicleId)
        {
            return await _context.Vehicles.AnyAsync(v => v.Id == vehicleId && v.IsAvailable);
        }

        public async Task<bool> MarkVehicleAsAvailable(int vehicleId)
        {
            var vehicle = await GetVehicleById(vehicleId);

            if (vehicle is null)
            {
                return false; // Return false if the vehicle doesn't exist
            }
            vehicle.IsAvailable = true;
            // Save the changes and return the result
            return await Save();
        }

        public async Task<bool> MarkVehicleAsUnavailable(int vehicleId)
        {
            var vehicle = await GetVehicleById(vehicleId);

            if (vehicle is null)
            {
                return false; // Return false if the vehicle doesn't exist
            }
            vehicle.IsAvailable = false;
            // Save the changes and return the result
            return await Save();
        }

        public async Task<bool> Save()
        {
            var saved = await _context.SaveChangesAsync();
            return saved > 0;
        }

        public async Task<bool> TransporterHasAvailableVehicle(int transporterId)
        {
            return await _context.Vehicles.AnyAsync(v => v.IsAvailable && v.TransporterId == transporterId);
        }

        public async Task<bool> UpdateVehicle(int vehicleId, UpdateVehicleDto vehicleDto)
        {
            try
            {
                var vehicleExists = await VehicleExists(vehicleId);

                if (!vehicleExists)
                {
                    return false;
                }

                Vehicle? existingVehicle = await GetVehicleById(vehicleId);

                existingVehicle!.Manufacture = vehicleDto.Manufacture;
                existingVehicle.Model = vehicleDto.Model;
                existingVehicle.Year = vehicleDto.Year;
                existingVehicle.Color = vehicleDto.Color;
                existingVehicle.VehicleType = vehicleDto.VehicleType;
                existingVehicle.Length = vehicleDto.Length;
                existingVehicle.Height = vehicleDto.Height;

                return await Save();
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to update vehicle.", ex);
            }
        }

        public async Task<bool> UpdateVehicleImages(int vehicleId, UpdateVehicleImagesDto vehicleImagesDto)
        {
            try
            {
                Vehicle? vehicleToUpdate = await GetVehicleById(vehicleId);
                if (vehicleToUpdate is null)
                {
                    return false;
                }
                else
                {
                    var oldImages = vehicleToUpdate.VehicleImages?.ToList() ?? new List<VehicleImage>();
                    _context.Images.RemoveRange(oldImages);
                    vehicleToUpdate?.VehicleImages?.Clear();
                    foreach (var formFile in vehicleImagesDto.VehicleImages)
                    {
                        using (var ms = new MemoryStream())
                        {
                            await formFile.CopyToAsync(ms);
                            byte[] bytes = ms.ToArray();

                            var vehicleImage = new VehicleImage
                            {
                                FileName = formFile.FileName,
                                UploadDate = DateTime.Now,
                                FileContentBase64 = bytes,
                            };

                            vehicleToUpdate?.VehicleImages?.Add(vehicleImage);
                        }
                    }
                    return await Save();
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to update vehicle images.", ex);
            }
        }

        public async Task<bool> VehicleExists(int vehicleId)
        {
            return await _context.Vehicles.AnyAsync(e => e.Id == vehicleId);
        }

        public async Task<bool> TransporterHasShipmentOnDate(int transporterId, DateTime date)
        {
            return await _context.Shipments.AnyAsync(s =>
                s.TransporterId == transporterId &&
                s.ShipmentDate.Date == date.Date);
        }

    }
}