using Backend.Data;
using Backend.Dtos.VehicleDtos;
using Backend.Interfaces;
using Backend.Models.classes;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;

namespace Backend.CachedRepositories
{
    public class CachedVehicleRepository : IVehicleRepository
    {
        private readonly IVehicleRepository _decorated;
        //private readonly IMemoryCache _memoryCache;
        private readonly IDistributedCache _distributedCache;
        private readonly DataContext _context;

        public CachedVehicleRepository(IVehicleRepository decorated, IDistributedCache distributedCache, DataContext context)
        {
            _distributedCache = distributedCache;
            _decorated = decorated;
            _context = context;
            //_memoryCache = memoryCache;
        }

        public Task<bool> CreateVehicle(CreateVehicleDto vehicle, int transporterId)
        {
            var result = _decorated.CreateVehicle(vehicle, transporterId);
            // Invalidate the cache entry associated with the transporters list
            string availableVehicles = "available-vehicles";
            string trasnporterVehicles = $"transporter-{transporterId}-vehicles";

            _distributedCache.Remove(availableVehicles);
            _distributedCache.Remove(trasnporterVehicles);

            return result;
        }

        public Task<bool> MarkVehicleAsUnavailable(int vehicleId)
        {
            var result = _decorated.MarkVehicleAsUnavailable(vehicleId);

            string availableVehicles = "available-vehicles";
            string vehicle = $"vehicle-{vehicleId}";
            string vehicleExists = $"vehicle-exists-{vehicleId}";
            string trasnporterVehicles = "transporter-*-vehicles";

            _distributedCache.Remove(availableVehicles);
            _distributedCache.Remove(trasnporterVehicles);
            _distributedCache.Remove(vehicleExists);
            _distributedCache.Remove(vehicle);
            return result;
        }

        public Task<bool> MarkVehicleAsAvailable(int vehicleId)
        {
            var result = _decorated.MarkVehicleAsAvailable(vehicleId);

            string availableVehicles = "available-vehicles";
            string vehicle = $"vehicle-{vehicleId}";
            string vehicleExists = $"vehicle-exists-{vehicleId}";
            string trasnporterVehicles = "transporter-*-vehicles";

            _distributedCache.Remove(availableVehicles);
            _distributedCache.Remove(trasnporterVehicles);
            _distributedCache.Remove(vehicleExists);
            _distributedCache.Remove(vehicle);
            return result;
        }

        public async Task<Vehicle?> GetVehicleById(int vehicleId)
        {
            string key = $"vehicle-{vehicleId}";
            string? cachedVehicle = await _distributedCache.GetStringAsync(key);
            Vehicle? vehicle;

            if (string.IsNullOrEmpty(cachedVehicle))
            {
                vehicle = await _decorated.GetVehicleById(vehicleId);

                if (vehicle is null)
                {
                    return vehicle;
                }

                await _distributedCache.SetStringAsync(
                    key,
                    JsonConvert.SerializeObject(vehicle)
                );
                return vehicle;
            }

            vehicle = JsonConvert.DeserializeObject<Vehicle>(cachedVehicle);

            if (vehicle is not null)
            {
                _context.Set<Vehicle>().Attach(vehicle);
            }

            return vehicle;

        }

        public async Task<ICollection<GetVehicleDto>?> GetVehicles()
        {
            string key = $"available-vehicles";
            string? cachedVehicles = await _distributedCache.GetStringAsync(key);
            ICollection<GetVehicleDto>? vehicles;

            if (string.IsNullOrEmpty(cachedVehicles))
            {
                vehicles = await _decorated.GetVehicles();

                if (vehicles is null)
                {
                    return vehicles;
                }

                await _distributedCache.SetStringAsync(
                    key,
                    JsonConvert.SerializeObject(vehicles)
                );
                return vehicles;
            }

            vehicles = JsonConvert.DeserializeObject<ICollection<GetVehicleDto>>(cachedVehicles);

            // if (vehicles is not null)
            // {
            //     foreach (var vehicle in vehicles)
            //     {
            //         _context.Set<GetVehicleDto>().Attach(vehicle);
            //     }
            // }

            return vehicles;
        }

        public async Task<ICollection<Vehicle>?> GetVehiclesByTransporterId(int transporterId)
        {
            string key = $"transporter-{transporterId}-vehicles";
            string? cachedVehicles = await _distributedCache.GetStringAsync(key);
            ICollection<Vehicle>? vehicles;

            if (string.IsNullOrEmpty(cachedVehicles))
            {
                vehicles = await _decorated.GetVehiclesByTransporterId(transporterId);

                if (vehicles is null)
                {
                    return vehicles;
                }

                await _distributedCache.SetStringAsync(
                    key,
                    JsonConvert.SerializeObject(vehicles)
                );
                return vehicles;
            }

            vehicles = JsonConvert.DeserializeObject<ICollection<Vehicle>>(cachedVehicles);

            if (vehicles is not null)
            {
                foreach (var vehicle in vehicles)
                {
                    _context.Set<Vehicle>().Attach(vehicle);
                }
            }

            return vehicles;
        }

        public async Task<bool> VehicleExists(int vehicleId)
        {
            string key = $"vehicle-exists-{vehicleId}";
            string? cachedVehicle = await _distributedCache.GetStringAsync(key);
            bool vehicleExists;

            if (string.IsNullOrEmpty(cachedVehicle))
            {
                vehicleExists = await _decorated.VehicleExists(vehicleId);

                if (!vehicleExists)
                {
                    return vehicleExists;
                }

                await _distributedCache.SetStringAsync(
                    key,
                    JsonConvert.SerializeObject(vehicleExists)
                );
                return vehicleExists;
            }

            // If cachedVehicle is not null, it means that the vehicle exists.
            return true;
        }

        public Task<bool> Save()
        {
            return _decorated.Save();
        }
    }
}