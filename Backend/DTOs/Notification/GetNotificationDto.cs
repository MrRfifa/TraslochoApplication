namespace Backend.DTOs.Notification
{
    public class GetNotificationDto
    {
        public int Id { get; set; } // This will be populated from the database
        public int UserId { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime DateSent { get; set; }
        public bool IsRead { get; set; }
    }
}