
namespace Backend.DTOs.Review
{
    public class GetReviewDto
    {
        public int Id { get; set; }
        public int Rating { get; set; } // Rating from 1 to 5
        public string Comment { get; set; } = string.Empty;
        public DateTime ReviewTime { get; set; }
    }
}