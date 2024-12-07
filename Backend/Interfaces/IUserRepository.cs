using Backend.Models.Classes.AddressesEntities;
using Backend.Models.Classes.UsersEntities;

namespace Backend.Interfaces
{
    public interface IUserRepository
    {
        //Get users
        Task<ICollection<Owner>> GetOwners();
        Task<ICollection<Transporter>> GetTransporters();

        //Get users by
        Task<User> GetUserById(int userId);
        Task<User> GetUserByEmail(string email);
        Task<User> GetUserByEmailChangeToken(string token);
        Task<User> GetUserByVerificationToken(string token);
        Task<User> GetUserByResetToken(string token);
        Task<Transporter> GetTransporterInfoById(int transporterId);
        
        //User Existence
        Task<bool> UserExistsById(int userId);
        Task<bool> UserExistsByEmail(string email);
        Task<bool> UserExistsByPhoneNumber(string phoneNumber);

        //User Changes
        public Task<bool> UpdateProfileImage(int userId, IFormFile file);
        Task<bool> ChangeNames(int userId, string newFirstname, string newLastname, string currentPassword);
        Task<bool> ChangeDob(int userId, DateTime newDob, string currentPassword);
        Task<bool> ChangeAddress(int userId, string newStreet, string newCity, string newState, string newPostalCode, string newCountry, string password);
        public Task<User> GetUserByDeleteAccountToken(string token);
        Task<bool> ChangePassword(int userId, string currentPassword, string newPassword, string confirmPassword);
        Task<bool> ChangeEmail(int userId, string newEmail, string currentPassword);
        Task<bool> Save();

        Task<UserAddress> GetUserAddress(int userId);
    }
}