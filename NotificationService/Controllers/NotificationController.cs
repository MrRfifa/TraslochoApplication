using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using NotificationService.Hub;
using NotificationService.Models;

namespace NotificationService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationController : ControllerBase
    {
        private readonly IHubContext<NotificationHub, INotificationClient> _hubContext;

        public NotificationController(IHubContext<NotificationHub, INotificationClient> notificationHubContext)
        {
            _hubContext = notificationHubContext;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendNotification([FromBody] NotificationRequest request)
        {
            // Validate the request (e.g., ensure UserId and Content are provided)
            if (request.UserId <= 0 || string.IsNullOrEmpty(request.Content))
            {
                return BadRequest(new { success = false, message = "UserId and Content are required." });
            }
            // Send notification to a specific user
            await _hubContext.Clients.Client(request.ConnectionId).ReceiveNotification(request);

            return Ok(new { success = true, message = "Notification sent successfully." });
        }

        [HttpPost("sendToTransporters")]
        public async Task<IActionResult> SendNotificationToGroup([FromBody] GroupNotificationRequest request)
        {
            // Validate the request (e.g., ensure Content is provided)
            if (string.IsNullOrEmpty(request.Content))
            {
                return BadRequest(new { success = false, message = "Message is required." });
            }
            // Send notification to the Transporters group
            await _hubContext.Clients.Group("Transporters").ReceiveGroupNotification(request);
            // Optionally save to the database here if needed
            return Ok(new { success = true, message = "Notification sent to group successfully." });
        }
    }
}