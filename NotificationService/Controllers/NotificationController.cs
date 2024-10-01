using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using NotificationService.Hubs;
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
            if (request.UserId <= 0 || string.IsNullOrEmpty(request.Message))
            {
                return BadRequest(new { success = false, message = "UserId and Content are required." });
            }

            // Send notification to a specific user
            await _hubContext.Clients.Client(request.ConnectionId).ReceiveNotification(request.Message);

            return Ok(new { success = true, message = "Notification sent successfully." });
        }
    }
}
