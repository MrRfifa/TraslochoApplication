using System.ComponentModel.DataAnnotations;

namespace Backend.Dtos.ReviewsDto
{
    public record CreateReviewDto
    {
        [Required(ErrorMessage = "Rating is required.")]
        public int Rating { get; set; }

        [Required(ErrorMessage = "Comment is required.")]
        public string Comment { get; set; } = string.Empty;
    }
}