using Backend.Dtos.ReviewsDto;

namespace Backend.Interfaces
{
    public interface IReviewRepository
    {
        Task<ICollection<GetReviewDto>?> GetAllReviews();
        Task<GetReviewDto?> GetReviewById(int reviewId);
        Task<ICollection<GetReviewDto>?> GetReviewsByTransporterId(int transporterId);
        Task<bool> ReviewExists(int reviewId);
        Task<bool> CreateReview(CreateReviewDto review, int transporterId, int ownerId);
        Task<bool> UpdateReview(int reviewId, CreateReviewDto reviewDto);
        Task<bool> DeleteReview(int reviewId);
        Task<bool> Save();
    }
}