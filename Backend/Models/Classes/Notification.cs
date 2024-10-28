
using Backend.Models.Classes.UsersEntities;

namespace Backend.Models.Classes
{
    public class Notification
    {
        public int Id { get; set; }
        public int UserId { get; set; }    // The ID of the user receiving the notification
        public string Content { get; set; } = string.Empty;  // Notification content
        public DateTime DateSent { get; set; }  // When the notification was sent
        public bool IsRead { get; set; }      // Flag to track if the user has read it
        // Navigation property to User
        public User? User { get; set; }
    }
}