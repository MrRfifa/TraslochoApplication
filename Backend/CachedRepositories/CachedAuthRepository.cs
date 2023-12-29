using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Dtos;
using Backend.Dtos.RegisterUsers;
using Backend.Interfaces;
using Microsoft.Extensions.Caching.Distributed;

namespace Backend.CachedRepositories
{
    public class CachedAuthRepository : IAuthRepository
    {

        private readonly IAuthRepository _decorated;
        private readonly IDistributedCache _distributedCache;
        private readonly DataContext _context;

        public CachedAuthRepository(IAuthRepository authRepository, IDistributedCache distributedCache, DataContext context)
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
            string cacheKey = $"login_token_{userLogged.Email}";

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

        public Task<bool> RegisterOwner(RegisterOwnerDto userCreated)
        {
            return _decorated.RegisterOwner(userCreated);
        }

        public Task<bool> RegisterTransporter(RegisterTransporterDto userCreated)
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