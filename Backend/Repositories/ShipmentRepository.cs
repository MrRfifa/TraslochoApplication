
using System.Net.Http.Headers;
using AutoMapper;
using Backend.Data;
using Backend.DTOs.Address;
using Backend.DTOs.Shipment;
using Backend.Interfaces;
using Backend.Models.Classes;
using Backend.Models.Classes.AddressesEntities;
using Backend.Models.Classes.ImagesEntities;
using Backend.Models.Enums;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;

namespace Backend.Repositories
{
    public class ShipmentRepository : IShipmentRepository
    {
        private readonly ApplicationDBContext _context;
        private readonly IMapper _mapper;
        private readonly HttpClient _httpClient;

        public ShipmentRepository(IMapper mapper, ApplicationDBContext context)
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

        public async Task<int> AddShipmentAddresses(int shipmentId, CreateAddressDto originAddress, CreateAddressDto destinationAddress)
        {
            try
            {
                // Fetch the shipment to update
                Shipment? shipmentToUpdate = await GetShipmentById(shipmentId);

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

                // Update shipment with the new addresses and calculated data
                shipmentToUpdate.OriginAddressId = originAddressEntity.Id;
                shipmentToUpdate.DestinationAddressId = destinationAddressEntity.Id;
                shipmentToUpdate.DistanceBetweenAddresses = distanceBetweenOriginDestination;
                shipmentToUpdate.Price = 5 * (int)distanceBetweenOriginDestination;

                // Save the updated shipment
                if (await Save())
                {
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

            // Save changes to the database
            await Save();
            return 1;
        }

        public async Task<bool> CreateShipment(CreateShipmentDto shipmentToCreate, int ownerId)
        {
            // Ensure that the owner doesn't have more than one shipment on the same day
            bool hasShipmentOnDate = await _context.Shipments.AnyAsync(s => s.OwnerId == ownerId
                && s.ShipmentDate.Date == shipmentToCreate.ShipmentDate.Date);

            if (hasShipmentOnDate)
            {
                throw new InvalidOperationException("You can only create one shipment per day.");
            }
            // Process the Shipment images
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
            return await Save();
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
            var shipment = await _context.Shipments
                .FirstOrDefaultAsync(u => u.Id == shipmentId);

            return shipment; // Return null if not found
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

        public async Task<ICollection<Shipment>?> GetShipmentsByOwnerId(int ownerId)
        {
            // Fetch shipments from the database where OwnerId matches the given ownerId
            var shipments = await _context.Shipments
                .Where(s => s.OwnerId == ownerId)
                .ToListAsync();

            // Return the result
            return shipments.Count > 0 ? shipments : null;
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

    }
}