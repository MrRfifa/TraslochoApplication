using System.Net.Http.Headers;
using AutoMapper;
using Backend.Data;
using Backend.Dtos.Shipment;
using Backend.Dtos.TransporterDto;
using Backend.Dtos.VehicleDtos;
using Backend.Interfaces;
using Backend.Models.classes;
using Backend.Models.enums;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;

namespace Backend.Repositories
{
    public class ShipmentRepository : IShipmentRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly HttpClient _httpClient;

        public ShipmentRepository(IMapper mapper, DataContext context)
        {
            DotNetEnv.Env.Load();

            var rapidAPIKey = Environment.GetEnvironmentVariable("RAPID_API_KEY");
            var rapidAPIService = Environment.GetEnvironmentVariable("RAPID_API_SERVICE");

            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Add("X-RapidAPI-Key", rapidAPIKey);
            _httpClient.DefaultRequestHeaders.Add("X-RapidAPI-Host", rapidAPIService);
            _mapper = mapper;
            _context = context;
        }

        public async Task<bool> AcceptShipment(int shipmentId, int transporterId)
        {

            Shipment shipment = await GetShipmentById(shipmentId);

            OwnerShipment? ownerShipment = await _context.OwnerShipments
                    .Where(os => os.ShipmentId == shipmentId)
                    .FirstOrDefaultAsync();
            // Get the corresponding TransporterShipment
            TransporterShipment? transporterShipment = await _context.TransporterShipments
                    .Where(os => os.ShipmentId == shipmentId)
                    .FirstOrDefaultAsync();

            if (ownerShipment == null || transporterShipment == null)
            {
                // Handle the case where the OwnerShipment is not found
                throw new Exception($"Transporter Shipment/Owner Shipment ID {shipmentId} not found");
            }

            if (shipment.ShipmentStatus == ShipmentStatus.Canceled && transporterId == shipment.TransporterId)
            {
                throw new Exception($"Transporter with ID {shipmentId} has canceled the shipment!");
            }
            if (shipment.ShipmentStatus == ShipmentStatus.Accepted && transporterId == shipment.TransporterId)
            {
                throw new Exception($"Transporter with ID {shipmentId} has already accepted the shipment!");
            }

            transporterShipment.ShipmentStatus = ShipmentStatus.Accepted;
            ownerShipment.ShipmentStatus = ShipmentStatus.Accepted;

            shipment.ShipmentStatus = ShipmentStatus.Accepted;

            return await Save();
        }

        public async Task<bool> CancelShipment(int shipmentId)
        {
            // Get the shipment
            Shipment shipment = await GetShipmentById(shipmentId);

            int daysDifference = (shipment.ShipmentDate - DateTime.Now).Days;

            if (daysDifference > 7)
            {
                // Get the corresponding OwnerShipment
                OwnerShipment? ownerShipment = await _context.OwnerShipments
                    .Where(os => os.ShipmentId == shipmentId)
                    .FirstOrDefaultAsync();
                // Get the corresponding TransporterShipment
                TransporterShipment? transporterShipment = await _context.TransporterShipments
                    .Where(os => os.ShipmentId == shipmentId)
                    .FirstOrDefaultAsync();

                if (ownerShipment == null || transporterShipment == null)
                {
                    // Handle the case where the OwnerShipment is not found
                    throw new Exception($"Shipment ID {shipmentId} not found");
                }
                // Update the shipment status
                shipment.ShipmentStatus = ShipmentStatus.Canceled;
                transporterShipment.ShipmentStatus = ShipmentStatus.Canceled;
                ownerShipment.ShipmentStatus = ShipmentStatus.Canceled;

                // Save changes to the database
                return await Save();
            }
            else
            {
                throw new Exception("Invalid shipment cancel. The shipment cancel date can only be modified if the difference is greater than 3 days.");
            }
        }

        public async Task<bool> CreateShipment(CreateShipmentDto shipmentToCreate, int transporterId, int ownerId, int transporterVehicleId)
        {
            try
            {
                // Map shipment DTO to entity
                var shipmentEntity = _mapper.Map<Shipment>(shipmentToCreate);

                // Process the vehicle images
                var shipmentImages = new List<ShipmentImage>();

                foreach (var formFile in shipmentToCreate.ShipmentImages)
                {
                    // Read the stream directly from the form file
                    using (var stream = formFile.OpenReadStream())
                    {
                        // Convert the image to a byte array
                        using (var ms = new MemoryStream())
                        {
                            await stream.CopyToAsync(ms);
                            byte[] bytes = ms.ToArray();

                            var shipmentImage = new ShipmentImage
                            {
                                FileName = formFile.FileName,
                                UploadDate = DateTime.Now,
                                FileContentBase64 = bytes,
                            };

                            shipmentImages.Add(shipmentImage);
                        }
                    }
                }

                var user = await _context.Transporters
                            .Include(u => u.UserAddress)
                            .Where(u => u.Id == transporterId)
                            .FirstOrDefaultAsync();

                if (user != null)
                {
                    shipmentEntity.DistanceBetweenAddresses = await GetDistanceBetweenCities(user.UserAddress.Country.ToString(),
                                                                                        user.UserAddress.City,
                                                                                        shipmentToCreate.DestinationAddress.Country,
                                                                                        shipmentToCreate.DestinationAddress.City);
                    shipmentEntity.OwnerId = ownerId;
                    shipmentEntity.TransporterId = transporterId;
                    shipmentEntity.ShipmentStatus = ShipmentStatus.Pending;
                    shipmentEntity.VehicleId = transporterVehicleId;
                    shipmentEntity.Images = shipmentImages;

                    _context.Add(shipmentEntity);
                    await Save();

                    TransporterShipment transporterShipment = new TransporterShipment
                    {
                        TransporterId = transporterId,
                        ShipmentId = shipmentEntity.Id,
                        VehicleId = transporterVehicleId,
                        ShipmentStatus = ShipmentStatus.Pending
                    };

                    OwnerShipment ownerShipment = new OwnerShipment
                    {
                        OwnerId = ownerId,
                        ShipmentId = shipmentEntity.Id,
                        VehicleId = transporterVehicleId,
                        ShipmentStatus = ShipmentStatus.Pending
                    };

                    _context.Add(transporterShipment);
                    _context.Add(ownerShipment);

                    return await Save();

                }
                else
                {
                    throw new Exception("A problem occured when getting the owner");
                }
            }
            catch (Exception ex)
            {
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

        public async Task<float> GetDistanceBetweenCities(string originCountry, string originCity, string destinationCountry, string destinationCity)
        {
            try
            {
                var requestContent = new
                {
                    route = new[]
                    {
                        new { country = originCountry, name = originCity },
                        new { country = destinationCountry, name = destinationCity }
                    }
                };

                var request = new HttpRequestMessage
                {
                    Method = HttpMethod.Post,
                    RequestUri = new Uri("https://distanceto.p.rapidapi.com/distance/route"),
                    Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(requestContent))
                    {
                        Headers =
                        {
                            ContentType = new MediaTypeHeaderValue("application/json")
                        }
                    }
                };

                using (var response = await _httpClient.SendAsync(request))
                {
                    response.EnsureSuccessStatusCode();
                    var responseBody = await response.Content.ReadAsStringAsync();

                    // Parse the JSON response
                    var jsonResponse = JObject.Parse(responseBody);

                    // Access the "car" property and get the "distance" value
                    float? carDistanceNullable = jsonResponse["route"]?["car"]?["distance"]?.Value<float>();
                    float carDistance = carDistanceNullable ?? 0;

                    return carDistance;
                }
            }
            catch (Exception)
            {
                return -1;
            }
        }

        public async Task<Shipment> GetShipmentById(int shipmentId)
        {
            if (!await ShipmentExists(shipmentId))
            {
                throw new Exception($"Shipment with ID {shipmentId} not found");
            }

            var shipment = await _context.Shipments
                .Where(u => u.Id == shipmentId)
                .FirstOrDefaultAsync();

            if (shipment == null)
            {
                throw new Exception($"Shipment with ID {shipmentId} not found");
            }

            return shipment;
        }

        public async Task<GetShipmentDto> GetShipmentDtoById(int shipmentId)
        {
            if (!await ShipmentExists(shipmentId))
            {
                throw new Exception($"Shipment with ID {shipmentId} not found");
            }

            var shipment = await _context.Shipments
                .Where(u => u.Id == shipmentId)
                .FirstOrDefaultAsync();

            if (shipment == null)
            {
                throw new Exception($"Shipment with ID {shipmentId} not found");
            }

            GetShipmentDto shipmentDto = _mapper.Map<GetShipmentDto>(shipment);

            return shipmentDto;
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

        public async Task<bool> ModifyShipmentDate(int shipmentId, DateTime newDate)
        {
            Shipment shipment = await GetShipmentById(shipmentId);

            int daysDifference = (shipment.ShipmentDate - DateTime.Now).Days;

            if (daysDifference > 3)
            {
                shipment.ShipmentDate = newDate;
                shipment.ShipmentStatus = ShipmentStatus.Pending;

                return await Save();
            }
            else
            {
                throw new Exception("Invalid shipment date update. The shipment date can only be modified if the difference is greater than 3 days.");
            }
        }

        public async Task<bool> NegociatePrice(int shipmentId, int newPrice)
        {
            Shipment shipment = await GetShipmentById(shipmentId);
            shipment.Price = newPrice;

            return await Save();
        }

        public async Task<bool> Save()
        {
            var saved = await _context.SaveChangesAsync();
            return saved > 0;
        }

        public async Task<bool> ShipmentExists(int shipmentId)
        {
            var shipmentExists = await _context.Shipments.AnyAsync(s => s.Id == shipmentId);
            if (!shipmentExists)
            {
                return false;
            }
            return true;
        }

    }
}