using Backend.DTOs.Notification;
using Backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationRepository _notificationRepository;

        public NotificationController(INotificationRepository notificationRepository)
        {
            _notificationRepository = notificationRepository;
        }

        [HttpGet("notifications-by-user/{userId:int}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<GetNotificationDto>))]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        [Authorize]
        public async Task<IActionResult> GetNotificationsByUserId(int userId)
        {
            try
            {
                var notifications = await _notificationRepository.GetUserNotifications(userId);

                if (notifications == null)
                {
                    return NotFound(new { status = "fail", message = "User not found." });
                }

                return Ok(new { status = "success", message = notifications });
            }
            catch (Exception)
            {
                return BadRequest(new { status = "fail", message = "An error occurred while fetching notifications." });
            }
        }


        [HttpGet("non-read-notifications-by-user/{userId:int}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<GetNotificationDto>))]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        [Authorize]
        public async Task<IActionResult> GetNonReadNotificationsByUserId(int userId)
        {
            try
            {
                var notifications = await _notificationRepository.GetUserNonReadNotifications(userId);

                if (notifications == null)
                {
                    return NotFound(new { status = "fail", message = "Notification not found." });
                }

                return Ok(new { status = "success", message = notifications });
            }
            catch (Exception)
            {
                return BadRequest(new { status = "fail", message = "An error occurred while fetching notifications." });
            }
        }

        [HttpGet("{notificationId:int}")]
        [ProducesResponseType(200, Type = typeof(GetNotificationDto))]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        [Authorize]
        public async Task<IActionResult> GetNotificationById(int notificationId)
        {
            try
            {
                var notificationDto = await _notificationRepository.GetNotificationById(notificationId);

                if (notificationDto == null)
                {
                    return NotFound(new { status = "fail", message = "Notification not found." });
                }

                return Ok(new { status = "success", message = notificationDto });
            }
            catch (Exception)
            {
                // Log the error (optional)
                return BadRequest(new { status = "fail", message = "An error occurred while fetching the Notification." });
            }
        }

        [HttpPut("{notificationId:int}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> MarkNotificationAsRead(int notificationId)
        {
            try
            {
                var updated = await _notificationRepository.MarkAsRead(notificationId);

                if (!updated)
                {
                    return NotFound(new { status = "fail", message = "Notification not found." });
                }

                return Ok(new { status = "success", message = "Notification marked as read successfully." });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { status = "fail", message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { status = "fail", message = ex.Message });
            }
        }

        
        [HttpPost("mark-all-as-read/{userId}")]
        public async Task<IActionResult> MarkAllAsRead(int userId)
        {
            var result = await _notificationRepository.MarkAllAsRead(userId);

            if (result)
            {
                return Ok(new { message = "All notifications marked as read successfully." });
            }
            else
            {
                return BadRequest(new { message = "Failed to mark notifications as read." });
            }
        }

        [HttpPost("create-notification")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> CreateNotification([FromForm] CreateNotificationDto notificationDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState); // Handles invalid model state
            }

            // Call the service method to create the review
            var result = await _notificationRepository.AddNotification(notificationDto);

            if (result)
            {
                return Ok(new { status = "success", message = "Review created successfully." });
            }
            if (!result)
            {
                return BadRequest(new { status = "fail", message = "Your review contains inappropriate language. Please respect others." });
            }

            return BadRequest(new { status = "fail", message = "Review creation failed. Ensure you have a completed shipment with this transporter." });
        }
    }
}