using AutoMapper;
using Backend.Data;
using Backend.DTOs.Notification;
using Backend.Interfaces;
using Backend.Models.Classes;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using StackExchange.Redis; // Make sure to include this namespace

namespace Backend.Repositories
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly ApplicationDBContext _context;
        private readonly HttpClient _httpClient;
        private readonly IMapper _mapper;
        private readonly IDatabase _redisDb;

        public NotificationRepository(ApplicationDBContext context, HttpClient httpClient, IMapper mapper, IDatabase redisDb)
        {
            _context = context;
            _httpClient = httpClient;
            _mapper = mapper;
            _redisDb = redisDb;
        }

        public async Task AddNotification(CreateNotificationDto notification)
        {
            var notificationEntity = new Notification
            {
                Content = notification.Content,
                UserId = notification.UserId,
                IsRead = false,
                DateSent = DateTime.Now,
            };
            await _context.Notifications.AddAsync(notificationEntity);
            await _context.SaveChangesAsync();
        }

        public async Task<GetNotificationDto?> GetNotificationById(int id)
        {
            var notification = await _context.Notifications.FindAsync(id);
            return _mapper.Map<GetNotificationDto>(notification);
        }

        public async Task<List<GetNotificationDto>?> GetUserNonReadNotifications(int userId)
        {
            var notifications = await _context.Notifications
                 .Where(n => n.UserId == userId && !n.IsRead)
                 .ToListAsync();
            return _mapper.Map<List<GetNotificationDto>>(notifications);
        }

        public async Task<List<GetNotificationDto>?> GetUserNotifications(int userId)
        {
            var notifications = await _context.Notifications
                 .Where(n => n.UserId == userId)
                 .ToListAsync();
            return _mapper.Map<List<GetNotificationDto>>(notifications);
        }

        public async Task<bool> MarkAsRead(int id)
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification != null)
            {
                notification.IsRead = true;
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<bool> SendNotification(SendNotificationDto notificationToSend)
        {
            try
            {
                // Send notification to the notification server
                string? connectionSignalR = Environment.GetEnvironmentVariable("SIGNALR_CONNECTION_STRING");
                if (connectionSignalR == null)
                {
                    throw new InvalidOperationException("The SIGNALR_CONNECTION_STRING environment variable is not set.");
                }
                var jsonContent = new StringContent(JsonConvert.SerializeObject(notificationToSend), System.Text.Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync($"{connectionSignalR}send", jsonContent);
                var notificationToCreate = new CreateNotificationDto
                {
                    UserId = notificationToSend.UserId,
                    Content = notificationToSend.Content
                };
                // Optionally handle the response
                if (!response.IsSuccessStatusCode)
                {
                    throw new Exception("Failed to send notification to the notification server.");
                }
                if (response.IsSuccessStatusCode)
                {
                    await AddNotification(notificationToCreate);
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                // Log the exception for troubleshooting
                Console.WriteLine($"Error sending notification: {ex.Message}");
                throw; // or handle appropriately
            }
        }

        public async Task<bool> MarkAllAsRead(int userId)
        {
            var notifications = await _context.Notifications
                .Where(n => n.UserId == userId && !n.IsRead)
                .ToListAsync();

            foreach (var notification in notifications)
            {
                notification.IsRead = true;
            }

            var result = await _context.SaveChangesAsync();
            return result > 0;
        }

        public async Task<bool> SendNotificationToGroup(SendNotificationGroupDto notificationToSend)
        {
            // Fetch the serialized transporter list from IDistributedCache
            var transporterIds = await _redisDb.SetMembersAsync("transporters_group");
            if (transporterIds == null || !transporterIds.Any())
            {
                throw new Exception("No transporters found in the group.");
            }
            string? connectionSignalR = Environment.GetEnvironmentVariable("SIGNALR_CONNECTION_STRING");
            if (connectionSignalR == null)
            {
                throw new InvalidOperationException("The SIGNALR_CONNECTION_STRING environment variable is not set.");
            }
            // Prepare the DTO with the transporter IDs
            var notificationToSendGroup = new SendNotificationGroupDto
            {
                // UserIds = transporterIds,
                Content = notificationToSend.Content
            };
            // Send notification to the notification server
            var jsonContent = new StringContent(JsonConvert.SerializeObject(notificationToSendGroup), System.Text.Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync($"{connectionSignalR}sendToTransporters", jsonContent);
            if (!response.IsSuccessStatusCode)
            {
                // Log failure but continue to return true for shipment creation
                Console.WriteLine("Failed to send notification to the notification server.");
                return true; // Still continue, as the shipment is created successfully
            }
            // Save notification for each transporter
            foreach (var userId in transporterIds)
            {
                // Convert RedisValue to int
                if (!int.TryParse(userId.ToString(), out int transporterId))
                {
                    Console.WriteLine("Unable to parse transporter ID to integer.");
                    // throw new InvalidOperationException("Unable to parse transporter ID to integer.");
                }
                var notificationToCreate = new CreateNotificationDto
                {
                    UserId = transporterId,
                    Content = notificationToSend.Content
                };
                // Store the notification in the database
                await AddNotification(notificationToCreate);
            }
            return true;
        }

    }
}