namespace Backend.DTOs.Notification
{
    public class SendNotificationDto
    {
        public int UserId { get; set; }
        public string Message { get; set; } = string.Empty;
        public string ConnectionId { get; set; } = string.Empty;
    }
}