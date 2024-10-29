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
            //TODO See if useless or not: If possible make it simple like if connected send it and then save to the database else save to the db directly without sending
            // // Retrieve the user's connection ID from Redis
            // var db = await _redis.GetDatabase();
            // var connectionId = await db.StringGetAsync($"{request.UserId}-connection");

            // if (!connectionId.HasValue)
            // {
            //     // User not connected or no valid connection ID
            //     return NotFound(new { success = false, message = "User is not currently connected." });
            // }

            // Send notification to a specific user
            await _hubContext.Clients.Client(request.ConnectionId).ReceiveNotification(request);

            return Ok(new { success = true, message = "Notification sent successfully." });
        }
    }
}