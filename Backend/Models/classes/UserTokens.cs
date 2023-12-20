
namespace Backend.Models.classes
{
    public class UserTokens
    {
        public int Id { get; set; }
        // Verification when a user register
        public string VerificationToken { get; set; } = string.Empty;
        public DateTime VerifiedAt { get; set; }

        // Verification when reset password request
        public string PasswordResetToken { get; set; } = string.Empty;
        public DateTime ResetTokenExpires { get; set; }
        public string NewEmail { get; set; } = string.Empty;

        // Verification when change email address request
        public string EmailChangeToken { get; set; } = string.Empty;
        public DateTime EmailChangeTokenExpires { get; set; }

        // Verification when deleting account
        public string DeleteAccountToken { get; set; } = string.Empty;
        public DateTime DeleteAccountTokenExpires { get; set; }
    }
}