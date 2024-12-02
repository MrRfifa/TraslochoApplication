
using Backend.Data;
using Backend.DTOs.Address;
using Backend.DTOs.Shipment;
using Backend.Interfaces;
using Backend.Models.Classes;
using Backend.Models.Classes.ImagesEntities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;

namespace Backend.Cached
{
    public class CachedShipmentRepository : IShipmentRepository
    {
        private readonly IShipmentRepository _decorated;
        private readonly IDistributedCache _distributedCache;
        public CachedShipmentRepository(IShipmentRepository shipmentRepository, IDistributedCache distributedCache)
        {
            _decorated = shipmentRepository;
            _distributedCache = distributedCache;
        }

        public async Task<int> AddShipmentAddresses(int shipmentId, CreateAddressDto originAddress, CreateAddressDto destinationAddress)
        {
            var result = await _decorated.AddShipmentAddresses(shipmentId, originAddress, destinationAddress);
            // After adding addresses, fetch the updated shipment
            var updatedShipment = await _decorated.GetShipmentById(shipmentId);
            if (updatedShipment != null)
            {
                var shipmentKey = $"shipment-{shipmentId}";
                var shipmentExistenceKey = $"shipment-exists-{shipmentId}";
                var pendingShipmentsKey = $"owner-pending-shipments-{updatedShipment.OwnerId}";
                // Cache the updated shipment in Redis
                await _distributedCache.SetStringAsync(shipmentKey, JsonConvert.SerializeObject(updatedShipment), new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1)
                });
                await _distributedCache.SetStringAsync(shipmentExistenceKey, JsonConvert.SerializeObject(updatedShipment), new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1)
                });
                // Remove the existing cached owner's shipments
                await _distributedCache.RemoveAsync(pendingShipmentsKey);
                var pendingShipments = await _decorated.GetPendingCompletedDataShipmentsByOwnerId(updatedShipment.OwnerId);
                if (pendingShipments != null && pendingShipments.Any())
                {
                    await _distributedCache.SetStringAsync(pendingShipmentsKey, JsonConvert.SerializeObject(pendingShipments), new DistributedCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1)
                    });
                }
            }

            return result;
        }

        public async Task<int> CancelShipment(int shipmentId)
        {
            var result = await _decorated.CancelShipment(shipmentId);
            if (result == 1)
            {
                var canceledShipment = await _decorated.GetShipmentById(shipmentId);
                if (canceledShipment != null)
                {
                    var shipmentKey = $"shipment-{shipmentId}";
                    var shipmentExistenceKey = $"shipment-exists-{shipmentId}";
                    var pendingShipmentsKey = $"owner-pending-shipments-{canceledShipment.OwnerId}";
                    var canceledShipmentsKey = $"owner-canceled-shipments-{canceledShipment.OwnerId}";
                    // Remove the shipment from the cache since it's canceled
                    await _distributedCache.RemoveAsync(shipmentKey);
                    await _distributedCache.RemoveAsync(shipmentExistenceKey);
                    await _distributedCache.RemoveAsync(pendingShipmentsKey);
                    await _distributedCache.RemoveAsync(canceledShipmentsKey);
                    var pendingShipments = await _decorated.GetPendingCompletedDataShipmentsByOwnerId(canceledShipment.OwnerId);
                    if (pendingShipments != null && pendingShipments.Any())
                    {
                        await _distributedCache.SetStringAsync(pendingShipmentsKey, JsonConvert.SerializeObject(pendingShipments), new DistributedCacheEntryOptions
                        {
                            AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1)
                        });
                    }
                    var canceledShipments = await _decorated.GetCanceledShipmentsByOwnerId(canceledShipment.OwnerId);
                    if (canceledShipments != null && canceledShipments.Any())
                    {
                        await _distributedCache.SetStringAsync(canceledShipmentsKey, JsonConvert.SerializeObject(canceledShipments), new DistributedCacheEntryOptions
                        {
                            AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1)
                        });
                    }
                }
            }
            return result;
        }

        public async Task<bool> CreateShipment(CreateShipmentDto shipment, int ownerId)
        {
            return await _decorated.CreateShipment(shipment, ownerId);
        }

        public async Task<ICollection<Shipment>?> GetAcceptedShipmentsByOwnerId(int ownerId)
        {
            string key = $"owner-accepted-shipments-{ownerId}";
            string? cachedAcceptedShipments = await _distributedCache.GetStringAsync(key);
            // If shipments are found in cache, deserialize and return them
            if (!string.IsNullOrEmpty(cachedAcceptedShipments))
            {
                return JsonConvert.DeserializeObject<List<Shipment>>(cachedAcceptedShipments) ?? new List<Shipment>();
            }
            // Otherwise, fetch from the database
            var shipments = await _decorated.GetAcceptedShipmentsByOwnerId(ownerId);

            // Return the shipments or an empty list if none found
            if (shipments != null && shipments.Any())
            {
                await _distributedCache.RemoveAsync(key);
                // Cache the result with expiration
                var cacheOptions = new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(60)
                };
                await _distributedCache.SetStringAsync(key, JsonConvert.SerializeObject(shipments), cacheOptions);
                return shipments;
            }
            return Enumerable.Empty<Shipment>().ToList();
        }

        public async Task<ICollection<Shipment>?> GetCanceledShipmentsByOwnerId(int ownerId)
        {
            string key = $"owner-canceled-shipments-{ownerId}";
            string? cachedCanceledShipments = await _distributedCache.GetStringAsync(key);
            // If shipments are found in cache, deserialize and return them
            if (!string.IsNullOrEmpty(cachedCanceledShipments))
            {
                return JsonConvert.DeserializeObject<List<Shipment>>(cachedCanceledShipments) ?? new List<Shipment>();
            }
            // Otherwise, fetch from the database
            var shipments = await _decorated.GetCanceledShipmentsByOwnerId(ownerId);
            // Return the shipments or an empty list if none found
            if (shipments != null && shipments.Any())
            {
                await _distributedCache.RemoveAsync(key);
                // Cache the result with expiration
                var cacheOptions = new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(60)
                };
                await _distributedCache.SetStringAsync(key, JsonConvert.SerializeObject(shipments), cacheOptions);
                return shipments;
            }
            return Enumerable.Empty<Shipment>().ToList();
        }

        public async Task<ICollection<Shipment>?> GetCompletedShipmentsByOwnerId(int ownerId)
        {
            string key = $"owner-completed-shipments-{ownerId}";
            string? cachedCompletedShipments = await _distributedCache.GetStringAsync(key);
            // If shipments are found in cache, deserialize and return them
            if (!string.IsNullOrEmpty(cachedCompletedShipments))
            {
                return JsonConvert.DeserializeObject<List<Shipment>>(cachedCompletedShipments) ?? new List<Shipment>();
            }
            // Otherwise, fetch from the database
            var shipments = await _decorated.GetCompletedShipmentsByOwnerId(ownerId);
            // Return the shipments or an empty list if none found
            if (shipments != null && shipments.Any())
            {
                await _distributedCache.RemoveAsync(key);
                // Cache the result with expiration
                var cacheOptions = new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(60)
                };
                await _distributedCache.SetStringAsync(key, JsonConvert.SerializeObject(shipments), cacheOptions);
                return shipments;
            }
            return Enumerable.Empty<Shipment>().ToList();
        }

        public async Task<float> GetDistanceBetweenCities(string originCountry, string originCity, string destinationCountry, string destinationCity)
        {
            return await _decorated.GetDistanceBetweenCities(originCountry, originCity, destinationCountry, destinationCity);
        }

        public async Task<ICollection<Shipment>?> GetPendingCompletedDataShipmentsByOwnerId(int ownerId)
        {
            string key = $"owner-pending-shipments-{ownerId}";
            string? cachedPendingShipments = await _distributedCache.GetStringAsync(key);
            // If shipments are found in cache, deserialize and return them
            if (!string.IsNullOrEmpty(cachedPendingShipments))
            {
                return JsonConvert.DeserializeObject<List<Shipment>>(cachedPendingShipments) ?? new List<Shipment>();
            }
            // Otherwise, fetch from the database
            var shipments = await _decorated.GetPendingCompletedDataShipmentsByOwnerId(ownerId);
            // Return the shipments or an empty list if none found
            if (shipments != null && shipments.Any())
            {
                await _distributedCache.RemoveAsync(key);
                // Cache the result with expiration
                var cacheOptions = new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(60)
                };
                await _distributedCache.SetStringAsync(key, JsonConvert.SerializeObject(shipments), cacheOptions);
                return shipments;
            }
            return Enumerable.Empty<Shipment>().ToList();
        }

        public Task<ICollection<GetAddressDto>?> GetShipmentAddresses(int shipmentId)
        {
            return _decorated.GetShipmentAddresses(shipmentId);
        }

        public async Task<Shipment?> GetShipmentById(int shipmentId)
        {
            string key = $"shipment-{shipmentId}";
            string? cachedShipment = await _distributedCache.GetStringAsync(key);

            // If shipment is found in cache, deserialize it
            if (!string.IsNullOrEmpty(cachedShipment))
            {
                return JsonConvert.DeserializeObject<Shipment>(cachedShipment);
            }

            // Otherwise, get from database
            var shipment = await _decorated.GetShipmentById(shipmentId);
            if (shipment != null)
            {
                // Serialize and cache it with an expiration time
                var cacheOptions = new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(60)
                };
                await _distributedCache.SetStringAsync(key, JsonConvert.SerializeObject(shipment), cacheOptions);
            }

            return shipment;
        }

        public async Task<GetShipmentDto?> GetShipmentDtoById(int shipmentId)
        {
            return await _decorated.GetShipmentDtoById(shipmentId);
        }

        public Task<ICollection<byte[]>?> GetShipmentAndImages(int shipmentId)
        {
            return _decorated.GetShipmentAndImages(shipmentId);
        }

        public async Task<ICollection<Shipment>?> GetUncompletedDataShipmentsByOwnerId(int ownerId)
        {

            var shipments = await _decorated.GetUncompletedDataShipmentsByOwnerId(ownerId);
            return shipments;
        }

        public async Task<int> MarkShipmentAsCompleted(int shipmentId)
        {
            var result = await _decorated.MarkShipmentAsCompleted(shipmentId);
            if (result == 1)
            {
                var completedShipment = await _decorated.GetShipmentById(shipmentId);
                if (completedShipment != null)
                {
                    var shipmentKey = $"shipment-{shipmentId}";
                    var shipmentExistenceKey = $"shipment-exists-{shipmentId}";
                    var acceptedShipmentsKey = $"owner-accepted-shipments-{completedShipment.OwnerId}";
                    var completedShipmentsKey = $"owner-completed-shipments-{completedShipment.OwnerId}";
                    // Remove the shipment from the cache since it's canceled
                    await _distributedCache.RemoveAsync(shipmentKey);
                    await _distributedCache.RemoveAsync(shipmentExistenceKey);
                    await _distributedCache.RemoveAsync(acceptedShipmentsKey);
                    await _distributedCache.RemoveAsync(completedShipmentsKey);
                    var acceptedShipments = await _decorated.GetAcceptedShipmentsByOwnerId(completedShipment.OwnerId);
                    if (acceptedShipments != null && acceptedShipments.Any())
                    {
                        await _distributedCache.SetStringAsync(acceptedShipmentsKey, JsonConvert.SerializeObject(acceptedShipments), new DistributedCacheEntryOptions
                        {
                            AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1)
                        });
                    }
                    var completedShipments = await _decorated.GetCompletedShipmentsByOwnerId(completedShipment.OwnerId);
                    if (completedShipments != null && completedShipments.Any())
                    {
                        await _distributedCache.SetStringAsync(completedShipmentsKey, JsonConvert.SerializeObject(completedShipments), new DistributedCacheEntryOptions
                        {
                            AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1)
                        });
                    }
                }
            }
            return result;
        }

        public async Task<int> ModifyShipmentDate(int shipmentId, DateTime newDate)
        {
            // Call the decorated method to modify the shipment date
            int result = await _decorated.ModifyShipmentDate(shipmentId, newDate);
            // Handle caching if modification was successful
            if (result == 1)
            {
                var updatedShipment = await _decorated.GetShipmentById(shipmentId);
                if (updatedShipment != null)
                {
                    // Define cache keys
                    string shipmentKey = $"shipment-{shipmentId}";
                    string ownerShipmentsKey = $"owner-pending-shipments-{updatedShipment.OwnerId}";
                    // Re-cache the updated shipment
                    _distributedCache.Remove(shipmentKey);
                    _distributedCache.Remove(ownerShipmentsKey);
                    await _distributedCache.SetStringAsync(
                        shipmentKey,
                        JsonConvert.SerializeObject(updatedShipment),
                        new DistributedCacheEntryOptions
                        {
                            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(60)
                        });
                    var ownerShipments = await _decorated.GetPendingCompletedDataShipmentsByOwnerId(updatedShipment.OwnerId);
                    if (ownerShipments != null && ownerShipments.Any())
                    {
                        await _distributedCache.SetStringAsync(
                            ownerShipmentsKey,
                            JsonConvert.SerializeObject(ownerShipments),
                            new DistributedCacheEntryOptions
                            {
                                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(60)
                            });
                    }
                }
            }

            return result;
        }

        public async Task<bool> Save()
        {
            return await _decorated.Save();
        }

        public async Task<bool> ShipmentExists(int shipmentId)
        {
            string key = $"shipment-exists-{shipmentId}";
            string? cachedShipment = await _distributedCache.GetStringAsync(key);

            if (!string.IsNullOrEmpty(cachedShipment))
            {
                return JsonConvert.DeserializeObject<bool>(cachedShipment);
            }

            bool shipmentExists = await _decorated.ShipmentExists(shipmentId);
            await _distributedCache.SetStringAsync(
                key,
                JsonConvert.SerializeObject(shipmentExists)
            );
            return shipmentExists;
        }

        public async Task<int> UpdateShipmentStatus(int shipmentId, int newStatus)
        {
            var result = await _decorated.UpdateShipmentStatus(shipmentId, newStatus);
            if (result == 1)
            {
                var updatedShipment = await _decorated.GetShipmentById(shipmentId);
                if (updatedShipment != null)
                {
                    var shipmentKey = $"shipment-{shipmentId}";
                    var shipmentExistenceKey = $"shipment-exists-{shipmentId}";
                    var pendingShipmentsKey = $"owner-pending-shipments-{updatedShipment.OwnerId}";
                    var canceledShipmentsKey = $"owner-canceled-shipments-{updatedShipment.OwnerId}";
                    var completedShipmentsKey = $"owner-completed-shipments-{updatedShipment.OwnerId}";
                    var acceptedShipmentsKey = $"owner-accepted-shipments-{updatedShipment.OwnerId}";
                    // Remove the shipment from the cache since it's canceled
                    await _distributedCache.RemoveAsync(shipmentKey);
                    await _distributedCache.RemoveAsync(shipmentExistenceKey);
                    await _distributedCache.RemoveAsync(pendingShipmentsKey);
                    await _distributedCache.RemoveAsync(canceledShipmentsKey);
                    await _distributedCache.RemoveAsync(completedShipmentsKey);
                    await _distributedCache.RemoveAsync(acceptedShipmentsKey);
                    var pendingShipments = await _decorated.GetPendingCompletedDataShipmentsByOwnerId(updatedShipment.OwnerId);
                    if (pendingShipments != null && pendingShipments.Any())
                    {
                        await _distributedCache.SetStringAsync(pendingShipmentsKey, JsonConvert.SerializeObject(pendingShipments), new DistributedCacheEntryOptions
                        {
                            AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1)
                        });
                    }
                    var canceledShipments = await _decorated.GetCanceledShipmentsByOwnerId(updatedShipment.OwnerId);
                    if (canceledShipments != null && canceledShipments.Any())
                    {
                        await _distributedCache.SetStringAsync(canceledShipmentsKey, JsonConvert.SerializeObject(canceledShipments), new DistributedCacheEntryOptions
                        {
                            AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1)
                        });
                    }
                    var acceptedShipments = await _decorated.GetAcceptedShipmentsByOwnerId(updatedShipment.OwnerId);
                    if (acceptedShipments != null && acceptedShipments.Any())
                    {
                        await _distributedCache.SetStringAsync(acceptedShipmentsKey, JsonConvert.SerializeObject(acceptedShipments), new DistributedCacheEntryOptions
                        {
                            AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1)
                        });
                    }
                    var completedShipments = await _decorated.GetCompletedShipmentsByOwnerId(updatedShipment.OwnerId);
                    if (completedShipments != null && completedShipments.Any())
                    {
                        await _distributedCache.SetStringAsync(completedShipmentsKey, JsonConvert.SerializeObject(completedShipments), new DistributedCacheEntryOptions
                        {
                            AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1)
                        });
                    }
                }
            }
            return result;
        }

        public async Task<ICollection<Shipment>?> GetPendingPassedShipments()
        {
            return await _decorated.GetPendingPassedShipments();
        }

        public async Task<ICollection<Shipment>?> GetAcceptedPassedShipments()
        {
            return await _decorated.GetAcceptedPassedShipments();
        }
    }
}