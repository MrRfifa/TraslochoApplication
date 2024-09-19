using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.Review
{
    public class CreateReviewDto
    {
        [Required]
        [Range(1, 5)]
        public int Rating { get; set; }

        [Required]
        [MinLength(1, ErrorMessage = "Comment cannot be under 1 characters")]
        public string Comment { get; set; } = string.Empty;
    }
}