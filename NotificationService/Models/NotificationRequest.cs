
namespace NotificationService.Models
{
    public class NotificationRequest
    {
        public int UserId { get; set; } // The ID of the user to receive the notification
        public string Message { get; set; } = string.Empty;
        public string ConnectionId { get; set; } = string.Empty;
    }
}