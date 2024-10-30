using Newtonsoft.Json;
namespace Backend.DTOs.Notification
{
    public class SendNotificationDto
    {
        public int UserId { get; set; }
        public string Content { get; set; } = string.Empty;

        // [JsonProperty("dateSent")]
        // public DateTime DateSent { get; set; } = DateTime.UtcNow; // Automatically sets to the current date and time
        // public bool IsRead { get; set; } = false;              // Automatically sets to unread
        public string ConnectionId { get; set; } = string.Empty;
    }
}