using System.Net.Http.Headers;
using AutoMapper;
using Backend.Data;
using Backend.Dtos.Shipment;
using Backend.Dtos.TransporterDto;
using Backend.Dtos.UsersDto;
using Backend.Dtos.VehicleDtos;
using Backend.Interfaces;
using Backend.Models.classes;
using Backend.Models.classes.UsersEntities;
using Backend.Models.enums;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;

namespace Backend.Repositories
{
    public class ShipmentRepository : IShipmentRepository
    {
        private readonly DataContext _context;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly HttpClient _httpClient;

        public ShipmentRepository(IMapper mapper, DataContext context, IUserRepository userRepository)
        {
            DotNetEnv.Env.Load();

            var rapidAPIKey = Environment.GetEnvironmentVariable("RAPID_API_KEY");
            var rapidAPIService = Environment.GetEnvironmentVariable("RAPID_API_SERVICE");

            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Add("X-RapidAPI-Key", rapidAPIKey);
            _httpClient.DefaultRequestHeaders.Add("X-RapidAPI-Host", rapidAPIService);
            _mapper = mapper;
            _context = context;
            _userRepository = userRepository;
        }

        public async Task<bool> AcceptShipment(int shipmentId, int transporterId)
        {

            Shipment? shipment = await GetShipmentById(shipmentId);

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

            if (shipment!.ShipmentStatus == ShipmentStatus.Canceled && transporterId == shipment.TransporterId)
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
            Shipment? shipment = await GetShipmentById(shipmentId);

            int daysDifference = (shipment!.ShipmentDate - DateTime.Now).Days;

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
                // Process the Shipment images
                var shipmentImages = new List<ShipmentImage>();
                var transporter = await _userRepository.GetUserById(transporterId);

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

                float distanceBetweenOriginDestination = await GetDistanceBetweenCities(
                    shipmentToCreate.OriginAddress.Country,
                    shipmentToCreate.OriginAddress.City,
                    shipmentToCreate.DestinationAddress.Country,
                    shipmentToCreate.DestinationAddress.City);

                //TODO fix this because it returns always 0 : return -1
                float distanceBetweenOriginUser = await GetDistanceBetweenCities(
                    transporter.UserAddress.Country.ToString(),
                    transporter.UserAddress.City,
                    shipmentToCreate.OriginAddress.Country,
                    shipmentToCreate.OriginAddress.City);

                // Map origin and destination addresses
                ShipmentAddress originAddressEntity = _mapper.Map<ShipmentAddress>(shipmentToCreate.OriginAddress);
                ShipmentAddress destinationAddressEntity = _mapper.Map<ShipmentAddress>(shipmentToCreate.DestinationAddress);

                // Map shipment DTO to entity
                var shipmentEntity = new Shipment
                {
                    ShipmentType = shipmentToCreate.ShipmentType,
                    ShipmentStatus = ShipmentStatus.Pending,
                    ShipmentDate = shipmentToCreate.ShipmentDate,
                    Price = 3 * ((int)(distanceBetweenOriginDestination + distanceBetweenOriginUser)),
                    DistanceBetweenAddresses = distanceBetweenOriginDestination,
                    Description = shipmentToCreate.Description,
                    OwnerId = ownerId,
                    TransporterId = transporterId,
                    VehicleId = transporterVehicleId,
                    Images = shipmentImages, // Assign images to the shipment entity
                    OriginAddress = originAddressEntity,
                    DestinationAddress = destinationAddressEntity,
                };

                // Add shipment entity to the context
                _context.Shipments.Add(shipmentEntity);
                await Save();

                originAddressEntity.ShipmentId = shipmentEntity.Id;
                destinationAddressEntity.ShipmentId = shipmentEntity.Id;
                await Save();

                // Create transporter and owner shipment entities
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

                // Add transporter and owner shipment entities to context
                _context.TransporterShipments.Add(transporterShipment);
                _context.OwnerShipments.Add(ownerShipment);

                // Save changes to the database
                return await Save();
            }
            catch (Exception ex)
            {
                // Log or handle the exception
                throw new Exception("Failed to create shipment", ex);
            }
        }


        public async Task<ICollection<GetVehicleDto>?> GetAvailableVehicles(DateTime shipmentDate)
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

        public async Task<Shipment?> GetShipmentById(int shipmentId)
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

        public async Task<GetShipmentDto?> GetShipmentDtoById(int shipmentId)
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

        public async Task<ICollection<GetTransporterDto>?> GetTransportersWithAvailableVehicles(DateTime shipmentDate)
        {
            var transportersWithAvailableVehicles = await _context.Transporters
                .Include(t => t.Vehicles)
                .Where(t => t.Vehicles!.Any(v => v.IsAvailable && !v.TransporterShipments!.Any(ts => ts.Shipment!.ShipmentDate == shipmentDate)))
                .OrderBy(t => t.Id)
                .ToListAsync();

            return _mapper.Map<ICollection<GetTransporterDto>>(transportersWithAvailableVehicles);
        }



        public async Task<List<Transporter>?> MatchTransporters(SearchUserCriteria criteria)
        {
            var matchedTransporters = await _context.Transporters
                .Include(t => t.Vehicles)
                .Where(t =>
                    t.UserAddress.Country == criteria.Country ||
                    t.UserAddress.City == criteria.City ||
                    t.Vehicles!.Any(v => v.VehicleType == criteria.VehicleType) ||
                    t.TransporterType == criteria.TransporterType)
                .ToListAsync();

            return matchedTransporters;
        }

        public async Task<bool> ModifyShipmentDate(int shipmentId, DateTime newDate)
        {
            Shipment? shipment = await GetShipmentById(shipmentId);

            int daysDifference = (shipment!.ShipmentDate - DateTime.Now).Days;

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
            Shipment? shipment = await GetShipmentById(shipmentId);
            shipment!.Price = newPrice;

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