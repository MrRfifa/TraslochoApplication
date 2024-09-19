
namespace Backend.DTOs.User
{
    public class GetUserDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;
        public byte[] FileContentBase64 { get; set; } = Array.Empty<byte>();
        public DateTime DateOfBirth { get; set; }
    }
}