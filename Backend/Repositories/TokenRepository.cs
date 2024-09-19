
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using Backend.Data;
using Backend.DTOs;
using Backend.Interfaces;
using Backend.Models.Classes.UsersEntities;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MimeKit;
using MimeKit.Text;

namespace Backend.Repositories
{
    public class TokenRepository : ITokenRepository
    {
        private readonly ApplicationDBContext _context;
        public TokenRepository(ApplicationDBContext context)
        {
            _context = context;

        }
        public void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA256())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        public string CreateToken(User user)
        {
            List<Claim> claims = new List<Claim>
            {
                // new Claim(ClaimTypes.DateOfBirth, user.DateOfBirth.ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role.ToString()),
            };

            var jwtKey = Environment.GetEnvironmentVariable("JWT_TOKEN");

            if (jwtKey != null)
            {
                var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(jwtKey));

                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    claims: claims,
                    expires: DateTime.Now.AddMinutes(45),
                    signingCredentials: creds
                );
                var jwt = new JwtSecurityTokenHandler().WriteToken(token);

                return jwt;
            }
            else
            {
                throw new Exception("JWT Key is not configured");
            }
        }

        public string CreateVerificationTokens()
        {
            return Convert.ToHexString(RandomNumberGenerator.GetBytes(10));
        }

        public async Task<string> GenerateUniqueToken()
        {
            int maxAttempts = 10;

            for (int attempt = 0; attempt < maxAttempts; attempt++)
            {
                string generatedToken = CreateVerificationTokens();

                var isTokenUnique = await _context.Users
                    .AnyAsync(u => u.UserTokens.VerificationToken == generatedToken ||
                                   u.UserTokens.PasswordResetToken == generatedToken ||
                                   u.UserTokens.EmailChangeToken == generatedToken);

                if (!isTokenUnique)
                {
                    return generatedToken;
                }
            }
            throw new Exception("Unable to generate a unique token after multiple attempts.");
        }


        public bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA256(passwordSalt))
            {
                passwordSalt = hmac.Key;
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(passwordHash);
            }
        }

        public void SendEmail(SendEmailRequest sendEmailRequest)
        {
            try
            {
                var emailAddress = Environment.GetEnvironmentVariable("EMAIL_ADDRESS");
                var emailUsername = Environment.GetEnvironmentVariable("EMAIL_USERNAME");
                var emailPassword = Environment.GetEnvironmentVariable("EMAIL_PASSWORD");
                var emailHost = Environment.GetEnvironmentVariable("EMAIL_HOST");

                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse(emailAddress));
                email.To.Add(MailboxAddress.Parse(sendEmailRequest.To));
                email.Subject = sendEmailRequest.Subject;
                email.Body = new TextPart(TextFormat.Html) { Text = sendEmailRequest.Body };

                using var smtp = new SmtpClient();

                smtp.Connect(emailHost, 587, SecureSocketOptions.StartTls);
                smtp.Authenticate(emailUsername, emailPassword);
                smtp.Send(email);
                smtp.Disconnect(true);

            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred: {ex.Message}");
            }
        }
    }
}