namespace Backend.Dtos.ReviewsDto
{
    public record GetReviewDto
    {
        public int Id { get; set; }
        public int Rating { get; set; } // Rating from 1 to 5
        public string Comment { get; set; } = string.Empty;
        public DateTime ReviewTime { get; set; }
        public int OwnerId { get; set; } // Foreign key for Owner
        public int TransporterId { get; set; } // Foreign key for Transporter
    }
}