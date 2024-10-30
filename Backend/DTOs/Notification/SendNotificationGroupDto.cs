
using Newtonsoft.Json;

namespace Backend.DTOs.Notification
{
    public class SendNotificationGroupDto
    {
        // public List<int> UserIds { get; set; } = new List<int>();
        public string Content { get; set; } = string.Empty;
    }
}