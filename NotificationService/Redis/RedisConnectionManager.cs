using StackExchange.Redis;

namespace NotificationService.Redis
{
    public class RedisConnectionManager
    {
        private readonly ConnectionMultiplexer _redis;

        public RedisConnectionManager(string connectionString)
        {
            _redis = ConnectionMultiplexer.Connect(connectionString);
        }

        public IDatabase GetDatabase()
        {
            return _redis.GetDatabase();
        }
    }
}