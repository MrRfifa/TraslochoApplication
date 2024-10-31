
using Backend.DTOs.Notification;
namespace Backend.Interfaces
{
    public interface INotificationRepository
    {
        Task<List<GetNotificationDto>?> GetUserNotifications(int userId);
        Task<List<GetNotificationDto>?> GetUserNonReadNotifications(int userId);
        Task<GetNotificationDto?> GetNotificationById(int id);
        Task AddNotification(CreateNotificationDto notification);
        Task<bool> SendNotification(SendNotificationDto notificationToSend);
        Task<bool> SendNotificationToGroup(SendNotificationGroupDto notificationToSend);
        Task<bool> MarkAsRead(int id);
        Task<bool> MarkAllAsRead(int id);
    }
}