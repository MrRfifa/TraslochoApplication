using Backend.Models.Classes.UsersEntities;

namespace Backend.Models.Classes
{
    public class Review
    {
        public int Id { get; set; }
        public int Rating { get; set; } // Rating from 1 to 5
        public string Comment { get; set; } = string.Empty;
        public DateTime ReviewTime { get; set; } = DateTime.Now;
        public int OwnerId { get; set; } // Foreign key for Owner
        public int TransporterId { get; set; } // Foreign key for Transporter

        // Navigation properties
        public Owner? Owner { get; set; }
        public Transporter? Transporter { get; set; }
    }
}