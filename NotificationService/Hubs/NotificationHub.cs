
using System.Collections.Concurrent;
using Microsoft.AspNetCore.SignalR;
using StackExchange.Redis;

namespace NotificationService.Hubs
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
            await Clients.Client(connectionId).ReceiveNotification("");

            // You could log the connectionId or do other connection setup here
            await base.OnConnectedAsync();
        }

        public string GetConnectionId()
        {
            return Context.ConnectionId;
        }

        // Method to explicitly associate a user with a connection ID and store it in Redis
        public async Task RegisterUser(string userId)
        {
            var connectionId = Context.ConnectionId;

            // Store connection ID in Redis with the custom user ID
            var db = _redis.GetDatabase();
            await db.StringSetAsync($"{userId}-connection", connectionId);

            // Optionally, notify the user
            await Clients.Client(connectionId).ReceiveNotification("");
        }

        // Explicitly delete user connection from Redis
        public async Task DeleteUser(string userId)
        {
            var db = _redis.GetDatabase();

            // Remove userId from Redis
            await db.KeyDeleteAsync($"{userId}-connection");

            // Optionally notify the user
            await Clients.Caller.ReceiveNotification("You have been logged out.");
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            return base.OnDisconnectedAsync(exception);
        }
    }
}

public interface INotificationClient
{
    Task ReceiveNotification(string message);
}