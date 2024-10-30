using Newtonsoft.Json;
namespace NotificationService.Models
{
    public class NotificationRequest
    {
        public int UserId { get; set; } // The ID of the user to receive the notification
        public string Content { get; set; } = string.Empty;
        public string ConnectionId { get; set; } = string.Empty;

        [JsonProperty("dateSent")]
        public DateTime DateSent { get; set; } = DateTime.UtcNow; // Default to current date/time
        public bool IsRead { get; set; } = false; // Default to false
    }
}