using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Dtos.RegisterUsers;
using Backend.Models.classes;

namespace Backend.Interfaces
{
    public interface IAuthRepository
    {
        public Task<string> Login(LoginUserDto userLogged);
        public Task<bool> RegisterTransporter(RegisterTransporterDto userCreated);
        public Task<bool> RegisterOwner(RegisterOwnerDto userCreated);
        public Task<bool> ForgetPassword(string email);
        public Task<bool> VerifyAccount(string token);
        public Task<bool> Save();
        Task<bool> DeleteAccount(int userId, string currentPassword);
        Task<bool> DeleteAccountVerification(string token);
    }
}