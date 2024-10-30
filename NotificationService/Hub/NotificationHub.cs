using System.Collections.Concurrent;
using Microsoft.AspNetCore.SignalR;
using StackExchange.Redis;
using NotificationService.Models;

namespace NotificationService.Hub
{
    public class NotificationHub : Hub<INotificationClient>
    {
        private static readonly ConcurrentDictionary<string, string> _connections = new();
        private readonly IConnectionMultiplexer _redis;

        public NotificationHub(IConnectionMultiplexer redis)
        {
            _redis = redis;
        }
        // Automatically called when a client connects
        public override async Task OnConnectedAsync()
        {
            var connectionId = Context.ConnectionId;
            await Clients.Client(connectionId).ReceiveShortNotification(connectionId);

            // You could log the connectionId or do other connection setup here
            await base.OnConnectedAsync();
        }

        public string GetConnectionId()
        {
            return Context.ConnectionId;
        }

        // Method to explicitly associate a user with a connection ID and store it in Redis
        public async Task RegisterUser(string userId, bool isTransporter)
        {
            var connectionId = Context.ConnectionId;

            // Store connection ID in Redis with the custom user ID
            var db = _redis.GetDatabase();
            await db.StringSetAsync($"{userId}-connection", connectionId);
            // Add transporter to Redis group if applicable
            if (isTransporter)
            {
                await db.SetAddAsync("transporters_group", userId);
                await Groups.AddToGroupAsync(connectionId, "Transporters");
            }
            // Optionally, notify the user
            await Clients.Client(connectionId).ReceiveShortNotification("You are now connected.");
        }

        // Explicitly delete user connection from Redis
        public async Task DeleteUser(string userId)
        {
            var db = _redis.GetDatabase();

            // Retrieve the current connection ID from Redis before deleting
            var connectionId = await db.StringGetAsync($"{userId}-connection");
            if (!connectionId.IsNullOrEmpty)
            {
                // Remove userId from Redis
                await db.KeyDeleteAsync($"{userId}-connection");
                // Remove the user from the SignalR group
                await Groups.RemoveFromGroupAsync(connectionId!, "Transporters");
                // Optionally notify the user
                // await Clients.Client(connectionId!).ReceiveShortNotification("You have been logged out.");
            }
            // Optionally notify the user
            // await Clients.Caller.ReceiveShortNotification("You have been logged out.");
        }

        public async override Task OnDisconnectedAsync(Exception? exception)
        {
            var connectionId = Context.ConnectionId;
            var userId = await FindUserIdByConnectionId(connectionId);

            if (userId != null)
            {
                var db = _redis.GetDatabase();
                await db.KeyDeleteAsync($"{userId}-connection");
            }

            await base.OnDisconnectedAsync(exception);
        }

        private async Task<string?> FindUserIdByConnectionId(string connectionId)
        {
            var db = _redis.GetDatabase();
            // Search Redis by pattern, assuming pattern-based search is possible in your environment
            //TODO Update the url with the env variable
            string? connectionRedis = Environment.GetEnvironmentVariable("REDIS_CONNECTION_STRING");
            var keys = _redis.GetServer(connectionRedis!).Keys(pattern: $"*-connection");

            foreach (var key in keys)
            {
                var storedConnectionId = await db.StringGetAsync(key);
                if (storedConnectionId == connectionId)
                {
                    return key.ToString().Split('-')[0]; // Extract userId from Redis key format "userId-connection"
                }
            }

            return null;
        }
    }
}

public interface INotificationClient
{
    // Method for sending a short notification message
    Task ReceiveShortNotification(string message);
    // Method for sending a full NotificationRequest object
    Task ReceiveNotification(NotificationRequest notification);
    // Method for sending a group notification
    Task ReceiveGroupNotification(GroupNotificationRequest notification);
}