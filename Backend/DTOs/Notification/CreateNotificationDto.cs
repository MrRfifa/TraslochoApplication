
namespace Backend.DTOs.Notification
{
    public class CreateNotificationDto
    {
        public int UserId { get; set; } // Include UserId for whom the notification is intended
        public string Content { get; set; } = string.Empty;
    }
}