using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos;
using Backend.Dtos.UsersDto;
using Backend.Models.classes;

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