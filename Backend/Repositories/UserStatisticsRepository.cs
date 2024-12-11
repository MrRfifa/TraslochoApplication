using System.Globalization;
using Backend.Data;
using Backend.DTOs.Statistics;
using Backend.Interfaces;
using Backend.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class UserStatisticsRepository : IUserStatisticsRepository
    {
        private readonly ApplicationDBContext _context;

        public UserStatisticsRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<List<object>> GetExpensesPerMonth(int ownerId)
        {
            // Step 1: Query raw data and group by Year and Month
            var rawData = await _context.Shipments
                .Where(s => s.OwnerId == ownerId && s.ShipmentStatus == ShipmentStatus.Completed)
                .GroupBy(s => new { s.ShipmentDate.Year, s.ShipmentDate.Month })
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    TotalAmount = g.Sum(s => s.Price)
                })
                .ToListAsync();

            // Step 2: Transform raw data into the required format
            var monthlyExpenses = rawData
                .OrderBy(data => new DateTime(data.Year, data.Month, 1)) // Sort by date
                .Select(data => new
                {
                    Name = new DateTime(data.Year, data.Month, 1).ToString("MMM", CultureInfo.InvariantCulture),
                    Shipments = data.TotalAmount
                })
                .ToList<object>();

            return monthlyExpenses;
        }

        public async Task<int> GetNumberOfCompletedShipments(int userId)
        {
            return await _context.Shipments
              .Where(s => (s.OwnerId == userId || s.TransporterId == userId) && s.ShipmentStatus == ShipmentStatus.Completed)
              .CountAsync();
        }

        public async Task<List<object>> GetNumberOfShipmentsPerMonth(int userId)
        {
            // Step 1: Filter shipments where the user is either the owner or the transporter
            var shipments = await _context.Shipments
                .Where(s => s.OwnerId == userId || s.TransporterId == userId)
                .GroupBy(s => new { s.ShipmentDate.Year, s.ShipmentDate.Month })
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    ShipmentCount = g.Count()
                })
                .ToListAsync();

            // Step 2: Transform raw data into the required format
            var monthlyShipments = shipments
                .OrderBy(data => new DateTime(data.Year, data.Month, 1)) // Sort first
                .Select(data => new
                {
                    Name = new DateTime(data.Year, data.Month, 1).ToString("MMM", CultureInfo.InvariantCulture),
                    Shipments = data.ShipmentCount
                })
                .ToList<object>();

            return monthlyShipments;
        }

        public async Task<List<object>> GetRevenuesPerMonth(int transporterId)
        {
            // Step 1: Query raw data and group by Year and Month
            var rawData = await _context.Shipments
                .Where(s => s.TransporterId == transporterId && s.ShipmentStatus == ShipmentStatus.Completed)
                .GroupBy(s => new { s.ShipmentDate.Year, s.ShipmentDate.Month })
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    TotalAmount = g.Sum(s => s.Price)
                })
                .ToListAsync();

            // Step 2: Transform raw data into the required format
            var monthlyRevenues = rawData
                .OrderBy(data => new DateTime(data.Year, data.Month, 1)) // Sort by date
                .Select(data => new
                {
                    Name = new DateTime(data.Year, data.Month, 1).ToString("MMM", CultureInfo.InvariantCulture),
                    Shipments = data.TotalAmount
                })
                .ToList<object>();

            return monthlyRevenues;
        }

        public async Task<List<ChartDataDto>> GetSentimentNumbers(int userId)
        {
            var reviewsSentiments = await _context.Reviews
                .Where(r => r.OwnerId == userId || r.TransporterId == userId)
                .GroupBy(r => r.Sentiment)
                .Select(g => new
                {
                    Status = g.Key,
                    Count = g.Count()
                })
                .ToListAsync();

            // Map the results to the desired format
            var sentimentChartData = new List<ChartDataDto>
                {
                    new ChartDataDto { Name = "Very Positive", Value = reviewsSentiments.FirstOrDefault(r => r.Status == "Very positive")?.Count ?? 0 },
                    new ChartDataDto { Name = "Positive", Value = reviewsSentiments.FirstOrDefault(r => r.Status == "positive")?.Count ?? 0 },
                    new ChartDataDto { Name = "Neutral", Value = reviewsSentiments.FirstOrDefault(r => r.Status == "neutral")?.Count ?? 0 },
                    new ChartDataDto { Name = "Negative", Value = reviewsSentiments.FirstOrDefault(r => r.Status == "negative")?.Count ?? 0 },
                    new ChartDataDto { Name = "Very Negative", Value = reviewsSentiments.FirstOrDefault(r => r.Status == "Very negative")?.Count ?? 0 },
                };

            return sentimentChartData;
        }

        public async Task<List<ChartDataDto>> GetShipmentStatus(int userId)
        {
            var shipmentStatuses = await _context.Shipments
                .Where(s => s.OwnerId == userId || s.TransporterId == userId) // Filter shipments by userId
                .GroupBy(s => s.ShipmentStatus)
                .Select(g => new
                {
                    Status = g.Key,
                    Count = g.Count()
                })
                .ToListAsync();

            var shipmentChartData = new List<ChartDataDto>
                {
                    new ChartDataDto { Name = "Completed", Value = shipmentStatuses.FirstOrDefault(s => s.Status == ShipmentStatus.Completed)?.Count ?? 0},
                    new ChartDataDto { Name = "Pending", Value = shipmentStatuses.FirstOrDefault(s => s.Status == ShipmentStatus.Pending)?.Count ?? 0 },
                    new ChartDataDto { Name = "Canceled", Value = shipmentStatuses.FirstOrDefault(s => s.Status == ShipmentStatus.Canceled)?.Count ?? 0 },
                    new ChartDataDto { Name = "Accepted", Value = shipmentStatuses.FirstOrDefault(s => s.Status == ShipmentStatus.Accepted)?.Count ?? 0 },
                };

            return shipmentChartData;
        }

        public async Task<float> GetTotalDistance(int userId)
        {
            return await _context.Shipments
                .Where(s => s.OwnerId == userId || s.TransporterId == userId)
                .SumAsync(s => s.DistanceBetweenAddresses);
        }

        public async Task<int> GetTotalExpenses(int ownerId)
        {
            return await _context.Shipments
           .Where(s => s.OwnerId == ownerId)
           .SumAsync(s => s.Price);
        }

        public async Task<int> GetTotalNumberOfRequests(int transporterId)
        {
            return await _context.Requests
                .Where(s => s.TransporterId == transporterId)
                .CountAsync();
        }

        public async Task<int> GetTotalNumberOfShipments(int ownerId)
        {
            return await _context.Shipments
                .Where(s => s.OwnerId == ownerId)
                .CountAsync();
        }

        public async Task<int> GetTotalRevenues(int transporterId)
        {
            return await _context.Shipments
                .Where(s => s.TransporterId == transporterId)
                .SumAsync(s => s.Price);
        }
    }
}