
using Backend.DTOs.Statistics;

namespace Backend.Interfaces
{
    public interface IUserStatisticsRepository
    {
        Task<int> GetNumberOfCompletedShipments(int userId);
        Task<float> GetTotalDistance(int userId);
        Task<List<ChartDataDto>> GetSentimentNumbers(int userId);
        Task<List<ChartDataDto>> GetShipmentStatus(int userId);
        Task<List<object>> GetNumberOfShipmentsPerMonth(int userId);
        Task<int> GetTotalNumberOfShipments(int ownerId);
        Task<int> GetTotalNumberOfRequests(int transporterId);
        Task<int> GetTotalRevenues(int transporterId);
        Task<int> GetTotalExpenses(int ownerId);
        Task<List<object>> GetRevenuesPerMonth(int transporterId);
        Task<List<object>> GetExpensesPerMonth(int ownerId);
    }
}