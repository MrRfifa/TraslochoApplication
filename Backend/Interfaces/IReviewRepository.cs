using Backend.DTOs;
using Backend.DTOs.Review;

namespace Backend.Interfaces
{
    public interface IReviewRepository
    {
        Task<ICollection<GetReviewDto>?> GetAllReviews();
        Task<GetReviewDto?> GetReviewById(int reviewId);
        Task<ICollection<GetReviewDto>?> GetReviewsByTransporterId(int transporterId);
        Task<ICollection<GetReviewDto>?> GetReviewsByOwnerId(int ownerId);
        Task<int> GetTransporterIdByReview(int reviewId);
        Task<bool> ReviewExists(int reviewId);
        Task<int> CreateReview(CreateReviewDto review, int transporterId, int ownerId);
        Task<bool> UpdateReview(int reviewId, CreateReviewDto reviewDto);
        Task<bool> DeleteReview(int reviewId);
        Task<bool> Save();
    }
}