using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Backend.Data;
using Backend.DTOs;
using Backend.DTOs.Review;
using Backend.Interfaces;
using Backend.Models.Classes;
using Backend.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class ReviewRepository : IReviewRepository
    {
        private readonly ApplicationDBContext _context;
        private readonly IMapper _mapper;

        public ReviewRepository(ApplicationDBContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<bool> CreateReview(CreateReviewDto review, int transporterId, int ownerId)
        {
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
            var review = await _context.Reviews.FindAsync(reviewId);
            if (review != null)
            {
                _context.Reviews.Remove(review);
                return await Save();
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
            var review = await _context.Reviews.FindAsync(reviewId);
            if (review == null)
            {
                return null;
            }

            return _mapper.Map<GetReviewDto>(review);
        }

        public async Task<ICollection<GetReviewDto>?> GetReviewsByOwnerId(int ownerId)
        {
            var transporterReviews = await _context.Reviews
                .Where(r => r.OwnerId == ownerId)
                .ToListAsync();

            return _mapper.Map<ICollection<GetReviewDto>>(transporterReviews);
        }

        public async Task<ICollection<GetReviewDto>?> GetReviewsByTransporterId(int transporterId)
        {
            var transporterReviews = await _context.Reviews
                .Where(r => r.TransporterId == transporterId)
                .ToListAsync();
            return _mapper.Map<ICollection<GetReviewDto>>(transporterReviews);
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
            var reviewEntity = await _context.Reviews.FindAsync(reviewId);
            if (reviewEntity is null)
            {
                return false; // Review not found
            }

            reviewEntity.Rating = reviewDto.Rating;
            reviewEntity.Comment = reviewDto.Comment;
            reviewEntity.ReviewTime = DateTime.UtcNow;
            return await Save();
        }

    }
}