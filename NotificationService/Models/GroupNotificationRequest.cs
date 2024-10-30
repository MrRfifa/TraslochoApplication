using Newtonsoft.Json;

namespace NotificationService.Models
{
    public class GroupNotificationRequest
    {
        public string Content { get; set; } = string.Empty;

        [JsonProperty("dateSent")]
        public DateTime DateSent { get; set; } = DateTime.UtcNow; // Default to current date/time
        public bool IsRead { get; set; } = false; // Default to false
    }
}