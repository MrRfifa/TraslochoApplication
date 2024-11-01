using System.Net.Http.Headers;
using AutoMapper;
using Backend.Data;
using Backend.DTOs.Address;
using Backend.DTOs.Notification;
using Backend.DTOs.Shipment;
using Backend.Interfaces;
using Backend.Models.Classes;
using Backend.Models.Classes.AddressesEntities;
using Backend.Models.Classes.ImagesEntities;
using Backend.Models.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json.Linq;

namespace Backend.Repositories
{
    public class ShipmentRepository : IShipmentRepository
    {
        private readonly ApplicationDBContext _context;
        private readonly INotificationRepository _notificationRepository;
        private readonly IMapper _mapper;
        private readonly HttpClient _httpClient;
        private readonly IDistributedCache _distributedCache;

        public ShipmentRepository(IMapper mapper,
                                ApplicationDBContext context,
                                INotificationRepository notificationRepository,
                                IDistributedCache distributedCache)
        {
            DotNetEnv.Env.Load();

            var rapidAPIKey = Environment.GetEnvironmentVariable("RAPID_API_KEY");
            var rapidAPIService = Environment.GetEnvironmentVariable("RAPID_API_SERVICE");

            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Add("X-RapidAPI-Key", rapidAPIKey);
            _httpClient.DefaultRequestHeaders.Add("X-RapidAPI-Host", rapidAPIService);
            _mapper = mapper;
            _context = context;
            _notificationRepository = notificationRepository;
            _distributedCache = distributedCache;
        }

        public async Task<int> AddShipmentAddresses(int shipmentId, CreateAddressDto originAddress, CreateAddressDto destinationAddress)
        {
            try
            {
                // Fetch the shipment with tracking enabled
                Shipment? shipmentToUpdate = await _context.Shipments
                    .SingleOrDefaultAsync(s => s.Id == shipmentId);

                if (shipmentToUpdate is null)
                {
                    return -1;  // Shipment not found
                }
                if (shipmentToUpdate.DestinationAddress is not null || shipmentToUpdate.DestinationAddressId is not null)
                {
                    return -2;
                }

                // Map DTO to ShipmentAddress entities
                ShipmentAddress originAddressEntity = _mapper.Map<ShipmentAddress>(originAddress);
                ShipmentAddress destinationAddressEntity = _mapper.Map<ShipmentAddress>(destinationAddress);

                // Set the ShipmentId for both addresses
                originAddressEntity.ShipmentId = shipmentId;
                destinationAddressEntity.ShipmentId = shipmentId;

                // Add the new addresses to the database (explicitly adding them)
                _context.ShipmentAddresses.Add(originAddressEntity);
                _context.ShipmentAddresses.Add(destinationAddressEntity);

                // Save addresses first
                if (!await Save())
                {
                    return 0;  // Failed to save addresses
                }

                // Calculate distance between the origin and destination
                float distanceBetweenOriginDestination = await GetDistanceBetweenCities(
                    originAddress.Country,
                    originAddress.City,
                    destinationAddress.Country,
                    destinationAddress.City
                );
                // Ensure IDs are available
                if (originAddressEntity.Id == 0 || destinationAddressEntity.Id == 0)
                {
                    throw new Exception("Address IDs not set.");
                }
                // Update shipment with the new addresses and calculated data
                shipmentToUpdate.OriginAddressId = originAddressEntity.Id;
                shipmentToUpdate.DestinationAddressId = destinationAddressEntity.Id;
                shipmentToUpdate.DistanceBetweenAddresses = distanceBetweenOriginDestination;
                shipmentToUpdate.Price = 5 * (int)distanceBetweenOriginDestination;
                // Save the updated shipment
                _context.Shipments.Update(shipmentToUpdate); // Track shipment update
                // Save the updated shipment
                if (await Save())
                {
                    SendNotificationGroupDto sendNotificationDto = new SendNotificationGroupDto
                    {
                        Content = "An owner has updated addresses."
                    };
                    await _notificationRepository.SendNotificationToGroup(sendNotificationDto);
                    return 1;  // Success
                }
                else
                {
                    return 0;  // Failed to save shipment update
                }
            }
            catch (Exception)
            {
                return 0;
            }
        }

        public async Task<int> CancelShipment(int shipmentId)
        {
            // Get the shipment
            Shipment? shipment = await GetShipmentById(shipmentId);
            if (shipment == null)
            {
                return -1; // Or throw an exception if needed for missing shipment
            }
            int daysDifference = (shipment.ShipmentDate - DateTime.Now).Days;
            if (daysDifference <= 3)
            {
                return 0; // Return false for invalid cancellation attempt
            }

            // Update the shipment status
            shipment.ShipmentStatus = ShipmentStatus.Canceled;
            // Notify the transporter if TransporterId is not null
            var transporterConnectionId = await _distributedCache.GetStringAsync($"{shipment.TransporterId}-connection");
            if (shipment.TransporterId.HasValue)
            {
                await NotifyUser(shipment.TransporterId.Value, transporterConnectionId, "A shipment has been canceled.");
            }
            // Save changes to the database
            await Save();
            return 1;
        }

        public async Task<bool> CreateShipment(CreateShipmentDto shipmentToCreate, int ownerId)
        {
            if (shipmentToCreate.ShipmentDate.Date < DateTime.Now.Date.AddDays(3))
            {
                throw new InvalidOperationException("Shipments must be scheduled at least 3 days in advance.");
            }

            // Ensure that the owner doesn't have more than one shipment on the same day
            bool hasShipmentOnDate = await _context.Shipments.AnyAsync(s => s.OwnerId == ownerId
                && s.ShipmentDate.Date == shipmentToCreate.ShipmentDate.Date);

            if (hasShipmentOnDate)
            {
                throw new InvalidOperationException("You can only create one shipment per day.");
            }

            // Process the shipment images
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

            // Create the shipment entity
            var shipmentEntity = new Shipment
            {
                ShipmentType = shipmentToCreate.ShipmentType,
                ShipmentStatus = ShipmentStatus.Pending,
                ShipmentDate = shipmentToCreate.ShipmentDate,
                Price = 0,
                DistanceBetweenAddresses = 0,
                Description = shipmentToCreate.Description,
                OwnerId = ownerId,
                Images = shipmentImages,
            };
            _context.Shipments.Add(shipmentEntity);
            var shipmentCreated = await Save();
            if (shipmentCreated)
            {
                SendNotificationGroupDto sendNotificationDto = new SendNotificationGroupDto
                {
                    Content = "A shipment has been created, wait for the owner to add addresses."
                };
                try
                {
                    await _notificationRepository.SendNotificationToGroup(sendNotificationDto);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Notification error: {ex.Message}");
                    // Log or handle notification failure separately if desired
                }
            }
            return shipmentCreated;
        }

        public async Task<ICollection<Shipment>?> GetAcceptedShipmentsByOwnerId(int ownerId)
        {
            var shipments = await _context.Shipments
                .Where(s => s.OwnerId == ownerId && s.ShipmentStatus == ShipmentStatus.Accepted)
                .ToListAsync();

            // Return the result
            return shipments.Count > 0 ? shipments : Enumerable.Empty<Shipment>().ToList();
        }

        public async Task<ICollection<Shipment>?> GetCanceledShipmentsByOwnerId(int ownerId)
        {
            var shipments = await _context.Shipments
                .Where(s => s.OwnerId == ownerId && s.ShipmentStatus == ShipmentStatus.Canceled)
                .ToListAsync();

            // Return the result
            return shipments.Count > 0 ? shipments : Enumerable.Empty<Shipment>().ToList();
        }

        public async Task<ICollection<Shipment>?> GetCompletedShipmentsByOwnerId(int ownerId)
        {
            var shipments = await _context.Shipments
    .Where(s => s.OwnerId == ownerId && s.ShipmentStatus == ShipmentStatus.Completed)
    .ToListAsync();

            // Return the result
            return shipments.Count > 0 ? shipments : Enumerable.Empty<Shipment>().ToList();
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

        public async Task<ICollection<Shipment>?> GetPendingShipmentsByOwnerId(int ownerId)
        {
            var shipments = await _context.Shipments
                .Where(s => s.OwnerId == ownerId && s.ShipmentStatus == ShipmentStatus.Pending)
                .ToListAsync();

            // Return the result
            return shipments.Count > 0 ? shipments : Enumerable.Empty<Shipment>().ToList();
        }

        public async Task<Shipment?> GetShipmentById(int shipmentId)
        {
            return await _context.Shipments
                            .Include(s => s.OriginAddress)
                            .Include(s => s.DestinationAddress)
                            .AsNoTracking() // Optional, if you only need to read
                            .SingleOrDefaultAsync(s => s.Id == shipmentId);
        }

        public async Task<GetShipmentDto?> GetShipmentDtoById(int shipmentId)
        {
            var shipment = await _context.Shipments
                .FirstOrDefaultAsync(u => u.Id == shipmentId);

            if (shipment == null)
            {
                return null; // Return null if shipment not found
            }

            // Map to GetShipmentDto using AutoMapper
            GetShipmentDto shipmentDto = _mapper.Map<GetShipmentDto>(shipment);

            return shipmentDto;
        }

        public async Task<int> MarkShipmentAsCompleted(int shipmentId)
        {
            // Fetch the shipment from the database
            var shipment = await GetShipmentById(shipmentId);

            // Check if the shipment exists
            if (shipment == null)
            {
                return -1; // Shipment not found
            }

            // Check if the shipment is already completed
            if (shipment.ShipmentStatus == ShipmentStatus.Completed)
            {
                return 0; // Shipment is already marked as completed
            }

            // Ensure the shipment date is today or in the past
            if (shipment.ShipmentDate >= DateTime.Now)
            {
                return -2; // Shipment date is in the future, cannot mark as completed
            }

            // Mark the shipment as completed
            shipment.ShipmentStatus = ShipmentStatus.Completed;
            // Notify the transporter if TransporterId is not null
            var transporterConnectionId = await _distributedCache.GetStringAsync($"{shipment.TransporterId}-connection");
            if (shipment.TransporterId.HasValue)
            {
                await NotifyUser(shipment.TransporterId.Value, transporterConnectionId, "The shipment has been completed.");
            }
            // Save changes to the database
            await Save();

            return 1; // Successfully marked as completed
        }

        public async Task<int> ModifyShipmentDate(int shipmentId, DateTime newDate)
        {
            var shipment = await _context.Shipments.FirstOrDefaultAsync(s => s.Id == shipmentId);

            if (shipment == null)
            {
                return -1; // Return null if shipment is not found
            }

            int daysDifference = (shipment.ShipmentDate - DateTime.Now).Days;

            if (daysDifference > 3)
            {
                shipment.ShipmentDate = newDate;
                shipment.ShipmentStatus = ShipmentStatus.Pending;

                await Save(); // Assuming Save returns a boolean
                // Notify the transporter if TransporterId is not null
                if (shipment.TransporterId.HasValue)
                {
                    var transporterConnectionId = await _distributedCache.GetStringAsync($"{shipment.TransporterId}-connection");
                    await NotifyUser(shipment.TransporterId.Value, transporterConnectionId, "The shipment date has been updated.");
                }
                return 1;
            }
            else
            {
                return 0; // Return false if the shipment can't be modified
            }
        }

        public async Task<bool> Save()
        {
            var saved = await _context.SaveChangesAsync();
            return saved > 0;
        }

        public async Task<bool> ShipmentExists(int shipmentId)
        {
            return await _context.Shipments.AnyAsync(s => s.Id == shipmentId);
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