
using Backend.Models.classes.UsersEntities;

namespace Backend.Models.classes
{
    public class Review
    //TODO: Add the repo controller
    {
        public int Id { get; set; }
        public int Rating { get; set; } // Rating from 1 to 5
        public string Comment { get; set; } = string.Empty;
        public DateTime ReviewTime { get; set; }
        public int OwnerId { get; set; } // Foreign key for Owner
        public int TransporterId { get; set; } // Foreign key for Transporter

        // Navigation properties
        public Owner? Owner { get; set; }
        public Transporter? Transporter { get; set; }
    }
}