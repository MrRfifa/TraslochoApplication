
using Backend.Models.classes.UsersEntities;

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

        //User Existence
        Task<bool> UserExistsById(int userId);
        Task<bool> UserExistsByEmail(string email);

        //User Changes
        public Task<bool> UpdateProfileImage(int userId, IFormFile file);
        Task<bool> ChangeNames(int userId, string newFirstname, string newLastname, string currentPassword);
        public Task<User> GetUserByDeleteAccountToken(string token);
        Task<bool> ChangePassword(int userId, string currentPassword, string newPassword, string confirmPassword);
        Task<bool> ChangeEmail(int userId, string newEmail, string currentPassword);
        Task<bool> Save();
    }
}