
using AutoMapper;
using Backend.Data;
using Backend.Dtos.ReviewsDto;
using Backend.Interfaces;
using Backend.Models.classes;
using Backend.Models.enums;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class ReviewRepository : IReviewRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public ReviewRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<bool> CreateReview(CreateReviewDto review, int transporterId, int ownerId)
        {
            // Input validation
            if (review.Rating < 1 || review.Rating > 5 || string.IsNullOrEmpty(review.Comment))
            {
                throw new ArgumentException("Invalid input data.");
            }

            bool completedShipment = _context.Shipments.Any(
                s => s.TransporterId == transporterId && s.OwnerId == ownerId && s.ShipmentStatus == ShipmentStatus.Completed
            );

            if (completedShipment)
            {
                Review reviewEntity = new Review
                {
                    Comment = review.Comment,
                    Rating = review.Rating,
                    OwnerId = ownerId,
                    TransporterId = transporterId,
                    ReviewTime = DateTime.Now,
                };

                await _context.Reviews.AddAsync(reviewEntity);
                return await Save();
            }
            return false;
        }

        public async Task<bool> DeleteReview(int reviewId)
        {
            if (await ReviewExists(reviewId))
            {
                var review = await _context.Reviews.FindAsync(reviewId);
                if (review != null)
                {
                    _context.Reviews.Remove(review);
                    return await Save();
                }
                return false;
            }
            return false;
        }

        public async Task<ICollection<GetReviewDto>?> GetAllReviews()
        {
            var reviews = await _context.Reviews.OrderBy(r => r.Id).ToListAsync();
            var reviewsDto = _mapper.Map<ICollection<GetReviewDto>>(reviews);
            return reviewsDto;
        }

        public async Task<GetReviewDto?> GetReviewById(int reviewId)
        {
            if (await ReviewExists(reviewId))
            {
                var review = await _context.Reviews.FirstOrDefaultAsync(v => v.Id == reviewId);
                return _mapper.Map<GetReviewDto>(review);
            }
            return null;
        }

        public async Task<ICollection<GetReviewDto>?> GetReviewsByTransporterId(int transporterId)
        {
            var transporterExists = await _context.Transporters.AnyAsync(t => t.Id == transporterId);

            if (transporterExists)
            {
                var transporterReviews = await _context.Reviews
                    .Where(r => r.TransporterId == transporterId)
                    .ToListAsync();

                if (transporterReviews.Any())
                {
                    return _mapper.Map<ICollection<GetReviewDto>>(transporterReviews);
                }
                else
                {
                    return Enumerable.Empty<GetReviewDto>().ToList();
                }
            }
            else
            {
                return null;
            }
        }

        public async Task<bool> ReviewExists(int reviewId)
        {
            return await _context.Reviews.AnyAsync(e => e.Id == reviewId);
        }

        public async Task<bool> Save()
        {
            var saved = await _context.SaveChangesAsync();
            return saved > 0;
        }

        public async Task<bool> UpdateReview(int reviewId, CreateReviewDto reviewDto)
        {
            bool isValid = reviewDto.Rating > 0 && reviewDto.Rating < 5 && !string.IsNullOrEmpty(reviewDto.Comment);
            var reviewEntity = await _context.Reviews.FindAsync(reviewId);

            if (reviewEntity is not null)
            {
                if (isValid)
                {
                    reviewEntity.Rating = reviewDto.Rating;
                    reviewEntity.Comment = reviewDto.Comment;
                    reviewEntity.ReviewTime = DateTime.UtcNow;
                    return await Save();
                }
                else
                {
                    throw new ArgumentException("Invalid review data. Rating must be between 1 and 5, and comment must not be empty.");
                }
            }
            else
            {
                return false;
            }
        }

    }
}