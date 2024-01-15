using Backend.Data;
using Backend.Dtos;
using Backend.Dtos.Shipment;
using Backend.Dtos.TransporterDto;
using Backend.Dtos.UsersDto;
using Backend.Dtos.VehicleDtos;
using Backend.Interfaces;
using Backend.Models.classes;
using Backend.Models.classes.UsersEntities;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;

namespace Backend.CachedRepositories
{
    public class CachedShipmentRepository : IShipmentRepository
    {
        private readonly IShipmentRepository _decorated;
        private readonly IDistributedCache _distributedCache;
        private readonly DataContext _context;

        public CachedShipmentRepository(IShipmentRepository shipmentRepository, IDistributedCache distributedCache, DataContext context)
        {
            _decorated = shipmentRepository;
            _distributedCache = distributedCache;
            _context = context;
        }

        public Task<bool> AcceptShipment(int shipmentId, int transporterId)
        {

            string shipment = $"shipment-{shipmentId}";
            string shipmentDto = $"shipment-dto-{shipmentId}";
            string shipmentExists = $"shipment-exists-{shipmentId}";

            _distributedCache.Remove(shipment);
            _distributedCache.Remove(shipmentDto);
            _distributedCache.Remove(shipmentExists);

            return _decorated.AcceptShipment(shipmentId, transporterId);
        }

        public Task<bool> CancelShipment(int shipmentId)
        {
            string shipment = $"shipment-{shipmentId}";
            string shipmentDto = $"shipment-dto-{shipmentId}";
            string shipmentExists = $"shipment-exists-{shipmentId}";

            _distributedCache.Remove(shipment);
            _distributedCache.Remove(shipmentDto);
            _distributedCache.Remove(shipmentExists);
            return _decorated.CancelShipment(shipmentId);
        }

        public Task<bool> CreateShipment(CreateShipmentDto shipment, int transporterId, int ownerId, int transporterVehicleId)
        {
            return _decorated.CreateShipment(shipment, transporterId, ownerId, transporterVehicleId);
        }

        public async Task<ICollection<GetVehicleDto>?> GetAvailableVehicles(DateTime shipmentDate)
        {
            string key = $"available-transporters-for-shipments";
            string? cachedShipments = await _distributedCache.GetStringAsync(key);
            ICollection<GetVehicleDto>? transporters;

            if (string.IsNullOrEmpty(cachedShipments))
            {
                transporters = await _decorated.GetAvailableVehicles(shipmentDate);

                if (transporters is null)
                {
                    return transporters;
                }

                await _distributedCache.SetStringAsync(
                    key,
                    JsonConvert.SerializeObject(transporters)
                );
                return transporters;
            }

            transporters = JsonConvert.DeserializeObject<ICollection<GetVehicleDto>>(cachedShipments);

            // if (transporters is not null)
            // {
            //     foreach (var vehicle in transporters)
            //     {
            //         _context.Set<GetVehicleDto>().Attach(vehicle);
            //     }
            // }

            return transporters;
        }

        public Task<float> GetDistanceBetweenCities(string originCountry, string originCity, string destinationCountry, string destinationCity)
        {
            return _decorated.GetDistanceBetweenCities(originCountry, originCity, destinationCountry, destinationCity);
        }

        public async Task<Shipment?> GetShipmentById(int shipmentId)
        {
            string key = $"shipment-{shipmentId}";
            string? cachedShipment = await _distributedCache.GetStringAsync(key);
            Shipment? shipment;

            if (string.IsNullOrEmpty(cachedShipment))
            {
                shipment = await _decorated.GetShipmentById(shipmentId);

                if (shipment is null)
                {
                    return shipment;
                }

                await _distributedCache.SetStringAsync(
                    key,
                    JsonConvert.SerializeObject(shipment)
                );
                return shipment;
            }

            shipment = JsonConvert.DeserializeObject<Shipment>(cachedShipment);

            if (shipment is not null)
            {
                _context.Set<Shipment>().Attach(shipment);
            }

            return shipment;
        }

        public async Task<GetShipmentDto?> GetShipmentDtoById(int shipmentId)
        {
            string key = $"shipment-dto-{shipmentId}";
            string? cachedShipment = await _distributedCache.GetStringAsync(key);
            GetShipmentDto? shipment;

            if (string.IsNullOrEmpty(cachedShipment))
            {
                shipment = await _decorated.GetShipmentDtoById(shipmentId);

                if (shipment is null)
                {
                    return shipment;
                }

                await _distributedCache.SetStringAsync(
                    key,
                    JsonConvert.SerializeObject(shipment)
                );
                return shipment;
            }

            shipment = JsonConvert.DeserializeObject<GetShipmentDto>(cachedShipment);

            // if (shipment is not null)
            // {
            //     _context.Set<Shipment>().Attach(shipment);
            // }

            return shipment;
        }

        public async Task<ICollection<GetTransporterDto>?> GetTransportersWithAvailableVehicles(DateTime shipmentDate)
        {
            // return _decorated.GetTransportersWithAvailableVehicles(shipmentDate);
            string key = $"available-trasnporters-{shipmentDate:yyyy-MM-dd}";
            string? cachedTransporters = await _distributedCache.GetStringAsync(key);
            ICollection<GetTransporterDto>? transporters;

            if (string.IsNullOrEmpty(cachedTransporters))
            {
                transporters = await _decorated.GetTransportersWithAvailableVehicles(shipmentDate);

                if (transporters is null)
                {
                    return transporters;
                }

                await _distributedCache.SetStringAsync(
                    key,
                    JsonConvert.SerializeObject(transporters)
                );
                return transporters;
            }

            transporters = JsonConvert.DeserializeObject<ICollection<GetTransporterDto>>(cachedTransporters);

            return transporters;
        }

        public async Task<List<Transporter>?> MatchTransporters(SearchUserCriteria criteria)
        {
            string key = $"matched-transporters-{criteria.Country}-{criteria.City}-{criteria.TransporterType}";
            string? cachedMatchedTransporters = await _distributedCache.GetStringAsync(key);
            List<Transporter>? transporters;

            if (string.IsNullOrEmpty(cachedMatchedTransporters))
            {
                transporters = await _decorated.MatchTransporters(criteria);

                if (transporters is null)
                {
                    return transporters;
                }

                await _distributedCache.SetStringAsync(
                    key,
                    JsonConvert.SerializeObject(transporters)
                );
                return transporters;
            }

            transporters = JsonConvert.DeserializeObject<List<Transporter>>(cachedMatchedTransporters);

            if (transporters is not null)
            {
                foreach (var vehicle in transporters)
                {
                    _context.Set<List<Transporter>>().Attach(transporters);
                }
            }

            return transporters;
        }

        public Task<bool> ModifyShipmentDate(int shipmentId, DateTime newDate)
        {
            string shipment = $"shipment-{shipmentId}";
            string shipmentDto = $"shipment-dto-{shipmentId}";
            string shipmentExists = $"shipment-exists-{shipmentId}";

            _distributedCache.Remove(shipment);
            _distributedCache.Remove(shipmentDto);
            _distributedCache.Remove(shipmentExists);

            return _decorated.ModifyShipmentDate(shipmentId, newDate);
        }

        public Task<bool> NegociatePrice(int shipmentId, int newPrice)
        {
            string shipment = $"shipment-{shipmentId}";
            string shipmentDto = $"shipment-dto-{shipmentId}";
            string shipmentExists = $"shipment-exists-{shipmentId}";

            _distributedCache.Remove(shipment);
            _distributedCache.Remove(shipmentDto);
            _distributedCache.Remove(shipmentExists);

            return _decorated.NegociatePrice(shipmentId, newPrice);
        }

        public Task<bool> Save()
        {
            return _decorated.Save();
        }

        public async Task<bool> ShipmentExists(int shipmentId)
        {
            string key = $"shipment-exists-{shipmentId}";
            string? cachedShipment = await _distributedCache.GetStringAsync(key);
            bool shipmentExists;

            if (string.IsNullOrEmpty(cachedShipment))
            {
                shipmentExists = await _decorated.ShipmentExists(shipmentId);

                if (!shipmentExists)
                {
                    return shipmentExists;
                }

                await _distributedCache.SetStringAsync(
                    key,
                    JsonConvert.SerializeObject(shipmentExists)
                );
                return shipmentExists;
            }

            // If cachedShipment is not null, it means that the vehicle exists.
            return true;
        }

    }
}