
using AutoMapper;
using Backend.Data;
using Backend.DTOs.Notification;
using Backend.Interfaces;
using Backend.Models.Classes;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace Backend.Repositories
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly ApplicationDBContext _context;
        private readonly HttpClient _httpClient;
        private readonly IMapper _mapper;

        public NotificationRepository(ApplicationDBContext context, HttpClient httpClient, IMapper mapper)
        {
            _context = context;
            _httpClient = httpClient;
            _mapper = mapper;
        }

        public async Task<bool> AddNotification(CreateNotificationDto notification)
        {
            var notificationEntity = new Notification
            {
                Content = notification.Content,
                UserId = notification.UserId,
                IsRead = false,
                DateSent = DateTime.Now,
            };

            await _context.Notifications.AddAsync(notificationEntity);

            // Save changes and return true if the save was successful, otherwise false
            var result = await _context.SaveChangesAsync();
            return result > 0; // Returns true if one or more entities were written to the database
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
            // Send notification to the notification server
            var jsonContent = new StringContent(JsonConvert.SerializeObject(notificationToSend), System.Text.Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync("http://localhost:5126/api/notification/send", jsonContent);
            var notificationToCreate = new CreateNotificationDto
            {
                UserId = notificationToSend.UserId,
                Content = notificationToSend.Message
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
    }
}