using AutoMapper;
using Backend.Data;
using Backend.Interfaces;
using Backend.Models.classes;
using Backend.Models.classes.UsersEntities;
using Backend.Models.enums;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ITokenRepository _tokenRepository;
        private readonly DataContext _context;

        public UserRepository(ITokenRepository tokenRepository, DataContext context)
        {
            _context = context;
            _tokenRepository = tokenRepository;
        }

        public async Task<bool> ChangeEmail(int userId, string newEmail, string currentPassword)
        {
            var user = await GetUserById(userId);

            if (user is null)
            {
                throw new Exception($"User with ID {userId} not found");
            }

            // Verify the user's password
            if (!_tokenRepository.VerifyPasswordHash(currentPassword, user.PasswordHash, user.PasswordSalt))
            {
                throw new Exception("Incorrect password. Email change request denied.");
            }

            user.UserTokens.NewEmail = newEmail;
            user.UserTokens.EmailChangeToken = await _tokenRepository.GenerateUniqueToken();
            user.UserTokens.EmailChangeTokenExpires = DateTime.Now.AddMinutes(15);

            return await Save();
        }

        public async Task<bool> ChangeNames(int userId, string newFirstname, string newLastname, string currentPassword)
        {
            var user = await GetUserById(userId);

            if (user is null)
            {
                throw new Exception($"User with ID {userId} not found");
            }

            // Verify the user's password
            if (!_tokenRepository.VerifyPasswordHash(currentPassword, user.PasswordHash, user.PasswordSalt))
            {
                throw new Exception("Incorrect password. Names change request denied.");
            }

            user.FirstName = newFirstname;
            user.LastName = newLastname;

            return await Save();
        }

        public async Task<bool> ChangePassword(int userId, string currentPassword, string newPassword, string confirmPassword)
        {
            var user = await GetUserById(userId);

            if (user is null)
            {
                throw new Exception($"User with ID {userId} not found");
            }
            if (!newPassword.Equals(confirmPassword))
            {
                throw new Exception("Incorrect passwords. Passwords do not match.");
            }
            // Verify the user's password
            if (!_tokenRepository.VerifyPasswordHash(currentPassword, user.PasswordHash, user.PasswordSalt))
            {
                throw new Exception("Incorrect password. Password change request denied.");
            }

            _tokenRepository.CreatePasswordHash(newPassword, out byte[] passwordHash, out byte[] passwordSalt);
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            return await Save();
        }

        public async Task<bool> ChangeAddress(int userId, string newStreet, string newCity, string newState, string newPostalCode, string newCountry, string password)
        {
            var user = await GetUserById(userId);

            if (user is null)
            {
                throw new Exception($"User with ID {userId} not found");
            }

            // Verify the user's password
            if (!_tokenRepository.VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
            {
                throw new Exception("Incorrect password. Address change request denied.");
            }

            var address = await GetUserAddress(userId);

            if (address is null)
            {
                throw new Exception($"Address for user with ID {userId} not found");
            }

            var country = Enum.GetValues(typeof(EUCountries))
                              .Cast<EUCountries>()
                              .FirstOrDefault(c => c.ToString().ToLower() == newCountry.ToLower());

            if (country == default(EUCountries))
            {
                throw new Exception($"Invalid country: {newCountry}");
            }

            address.Street = newStreet;
            address.City = newCity;
            address.State = newState;
            address.PostalCode = newPostalCode;
            address.Country = country;

            return await Save();
        }

        public async Task<bool> ChangeDob(int userId, DateTime newDob, string currentPassword)
        {
            var user = await GetUserById(userId);

            if (user is null)
            {
                throw new Exception($"User with ID {userId} not found");
            }

            // Verify the user's password
            if (!_tokenRepository.VerifyPasswordHash(currentPassword, user.PasswordHash, user.PasswordSalt))
            {
                throw new Exception("Incorrect password. Names change request denied.");
            }

            user.DateOfBirth = newDob;
            return await Save();
        }

        public async Task<ICollection<Owner>> GetOwners()
        {
            return await _context.Owners.OrderBy(u => u.Id).ToListAsync();
        }

        public async Task<ICollection<Transporter>> GetTransporters()
        {
            return await _context.Transporters.OrderBy(u => u.Id).ToListAsync();
        }

        public async Task<User> GetUserByDeleteAccountToken(string token)
        {
            var users = await _context.Users
                .Include(u => u.UserTokens)
                .Where(u => u.UserTokens.DeleteAccountToken == token)
                .ToListAsync();

            var user = users.FirstOrDefault();

            if (user is null)
            {
                throw new Exception("User not found");
            }

            return user;
        }

        public async Task<User> GetUserByEmail(string email)
        {
            var user = await _context.Users
                .Include(u => u.UserTokens)
                .Where(u => u.Email == email)
                .FirstOrDefaultAsync();

            if (user is null)
            {
                throw new Exception($"User with email: {email} not found");
            }

            return user;
        }

        public async Task<User> GetUserByEmailChangeToken(string token)
        {
            var user = await _context.Users
                .Include(u => u.UserTokens)
                .Where(u => u.UserTokens.EmailChangeToken == token)
                .FirstOrDefaultAsync();

            if (user is null)
            {
                throw new Exception("User not found");
            }

            return user;
        }

        public async Task<User> GetUserById(int userId)
        {
            var userExists = await UserExistsById(userId);

            if (!userExists)
            {
                throw new Exception($"User with ID {userId} not found");
            }

            var user = await _context.Users
                .Include(u => u.UserTokens)
                .Where(u => u.Id == userId)
                .FirstOrDefaultAsync();

            if (user is null)
            {
                throw new Exception($"User with ID {userId} not found");
            }

            return user;
        }

        public async Task<bool> Save()
        {
            var saved = await _context.SaveChangesAsync();
            return saved > 0;
        }


        public async Task<bool> UpdateProfileImage(int userId, IFormFile file)
        {
            var user = await GetUserById(userId);

            if (user == null)
            {
                throw new Exception("User not found");
            }
            using (var ms = new MemoryStream())
            {
                await file.CopyToAsync(ms);

                // Convert the image to a base64-encoded string.
                byte[] bytes = ms.ToArray();
                string base64Image = Convert.ToBase64String(bytes);

                user.FileName = file.FileName;
                user.FileContentBase64 = bytes;
            }
            return await Save();
        }

        public async Task<bool> UserExistsById(int userId)
        {
            var userExists = await _context.Users.AnyAsync(a => a.Id == userId);
            if (!userExists)
            {
                return false;
            }
            return true;
        }

        public async Task<User> GetUserByVerificationToken(string token)
        {
            var user = await _context.Users
                .Include(u => u.UserTokens)
                .Where(u => u.UserTokens.VerificationToken == token)
                .FirstOrDefaultAsync();

            if (user is null)
            {
                throw new Exception("User not found");
            }

            return user;
        }

        public async Task<User> GetUserByResetToken(string token)
        {
            var user = await _context.Users
                .Include(u => u.UserTokens)
                .Where(u => u.UserTokens.PasswordResetToken == token)
                .FirstOrDefaultAsync();

            if (user is null)
            {
                throw new Exception("User not found");
            }

            return user;
        }

        public async Task<bool> UserExistsByEmail(string email)
        {
            var userExists = await _context.Users.AnyAsync(a => a.Email == email);
            if (!userExists)
            {
                return false;
            }
            return true;
        }

        public async Task<UserAddress> GetUserAddress(int userId)
        {
            var user = await _context.Users
                .Include(u => u.UserAddress)
                .FirstOrDefaultAsync(u => u.UserAddress.UserId == userId);

            if (user is null || user.UserAddress is null)
            {
                throw new Exception("User or user address not found");
            }

            return user.UserAddress;
        }

    }

}