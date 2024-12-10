
namespace Backend.DTOs.Review
{
    public class GetReviewDto
    {
        public int Id { get; set; }
        public int Rating { get; set; } // Rating from 1 to 5
        public string Comment { get; set; } = string.Empty;
        public string Sentiment { get; set; } = string.Empty;
        public DateTime ReviewTime { get; set; }

        //Owner details
        public int OwnerId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public byte[] FileContentBase64 { get; set; } = Array.Empty<byte>();
    }
}