using Backend.DTOs.User;

namespace Backend.Interfaces
{
    public interface IAuthRepository
    {
        public Task<string> Login(LoginUserDto userLogged);
        public Task<bool> Logout(int userId);
        public Task<bool> RegisterTransporter(RegisterUserDto userCreated);
        public Task<bool> RegisterOwner(RegisterUserDto userCreated);
        public Task<bool> ForgetPassword(string email);
        public Task<bool> VerifyAccount(string token);
        public Task<bool> Save();
    }
}