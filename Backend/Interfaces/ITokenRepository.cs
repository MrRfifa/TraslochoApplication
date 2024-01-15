using Backend.Dtos.Requests;
using Backend.Models.classes.UsersEntities;

namespace Backend.Interfaces
{
    public interface ITokenRepository
    {
        public void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt);
        public string CreateToken(User user);
        public bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt);

        public Task<string> GenerateUniqueToken();
        public string CreateVerificationTokens();
        public void SendEmail(SendEmailRequest sendEmailRequest);
    }
}