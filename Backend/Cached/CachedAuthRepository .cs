
using Backend.Data;
using Backend.DTOs.User;
using Backend.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;

namespace Backend.Cached
{
    public class CachedAuthRepository : IAuthRepository
    {
        private readonly IAuthRepository _decorated;
        private readonly IDistributedCache _distributedCache;
        private readonly ApplicationDBContext _context;
        public CachedAuthRepository(IAuthRepository authRepository, IDistributedCache distributedCache, ApplicationDBContext context)
        {
            _decorated = authRepository;
            _distributedCache = distributedCache;
            _context = context;
        }

        public Task<bool> ForgetPassword(string email)
        {
            return _decorated.ForgetPassword(email);
        }

        public async Task<string> Login(LoginUserDto userLogged)
        {
            var connectedUser = await _context.Users
                .Include(u => u.UserTokens)
                .Where(u => u.Email == userLogged.Email)
                .FirstOrDefaultAsync();
            string cacheKey = $"connected-{connectedUser!.Id}";
            // Try to get the token from cache
            var cachedToken = await _distributedCache.GetStringAsync(cacheKey);
            if (cachedToken != null)
            {
                // Token found in cache
                return cachedToken;
            }
            // Token not found in cache, proceed with authentication
            var token = await _decorated.Login(userLogged);
            // Cache the token with a TTL (time-to-live) if authentication is successful
            if (!string.IsNullOrEmpty(token))
            {
                var cacheOptions = new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(45)
                };
                await _distributedCache.SetStringAsync(cacheKey, token, cacheOptions);
            }
            return token;
        }

        public async Task<bool> Logout(int userId)
        {
            string cacheKey = $"connected-{userId}";
            var cachedToken = await _distributedCache.GetStringAsync(cacheKey);
            if (cachedToken != null)
            {
                await _distributedCache.RemoveAsync(cacheKey);
                return await _decorated.Logout(userId);
            }
            // If the token was not found in the cache, consider it a successful logout
            return true;
        }

        public Task<bool> RegisterOwner(RegisterUserDto userCreated)
        {
            return _decorated.RegisterOwner(userCreated);
        }

        public Task<bool> RegisterTransporter(RegisterUserDto userCreated)
        {
            return _decorated.RegisterTransporter(userCreated);
        }

        public Task<bool> Save()
        {
            return _decorated.Save();
        }

        public Task<bool> VerifyAccount(string token)
        {
            return _decorated.VerifyAccount(token);
        }
    }
}