using System.Collections.Concurrent;
using Microsoft.AspNetCore.SignalR;
using StackExchange.Redis;

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
            await Clients.Client(connectionId).ReceiveNotification(connectionId);

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
            await Clients.Client(connectionId).ReceiveNotification("You are now connected.");
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
            var keys = _redis.GetServer("localhost:6379").Keys(pattern: $"*-connection");

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
    Task ReceiveNotification(string message);
}