using System.Text;
using System.Text.Json;
using AutoMapper;
using Backend.Data;
using Backend.DTOs;
using Backend.DTOs.Notification;
using Backend.DTOs.Review;
using Backend.Interfaces;
using Backend.Models.Classes;
using Backend.Models.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using StackExchange.Redis;

namespace Backend.Repositories
{
    public class ReviewRepository : IReviewRepository
    {
        private readonly ApplicationDBContext _context;
        private readonly INotificationRepository _notificationRepository;
        private readonly IMapper _mapper;
        private readonly HttpClient _httpClient;
        private readonly IConnectionMultiplexer _redis;

        public ReviewRepository(ApplicationDBContext context,
                                INotificationRepository notificationRepository,
                                IMapper mapper,
                                HttpClient httpClient,
                                IConnectionMultiplexer redis)
        {
            _context = context;
            _mapper = mapper;
            _httpClient = httpClient;
            _notificationRepository = notificationRepository;
            _redis = redis;
        }
        public async Task<int> CreateReview(CreateReviewDto review, int transporterId, int ownerId)
        {
            bool completedShipment = _context.Shipments.Any(
                s => s.TransporterId == transporterId && s.OwnerId == ownerId && s.ShipmentStatus == ShipmentStatus.Completed
            );

            if (completedShipment)
            {
                string sentiment = await PredictSentimentAsync(review.Comment);
                // Check if the sentiment is an error message (indicating inappropriate language)
                if (sentiment.StartsWith("Your review contains inappropriate language") ||
                    sentiment.StartsWith("An error occurred"))
                {
                    return -1; // Return false and the error message
                }

                Review reviewEntity = new Review
                {
                    Comment = review.Comment,
                    Rating = review.Rating,
                    OwnerId = ownerId,
                    TransporterId = transporterId,
                    ReviewTime = DateTime.Now,
                    Sentiment = sentiment
                };
                var db = _redis.GetDatabase();
                var transporterConnectionId = await db.StringGetAsync($"{transporterId}-connection");
                await _context.Reviews.AddAsync(reviewEntity);
                var reviewCreation = await Save();
                // await Save(); // Ensure you await the save operation
                if (reviewCreation)
                {
                    try
                    {
                        await NotifyUser(transporterId, transporterConnectionId, $"New feedback received! You've got A {review.Rating}-star review.");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Notification error: {ex.Message}");
                        // Log or handle notification failure separately if desired
                    }

                }
                return 1; // Return success and a success message
            }
            return 0;
        }

        public async Task<bool> DeleteReview(int reviewId)
        {
            var review = await _context.Reviews.FindAsync(reviewId);
            if (review != null)
            {
                int transporterId = await GetTransporterIdByReview(reviewId);
                var db = _redis.GetDatabase();
                var transporterConnectionId = await db.StringGetAsync($"{transporterId}-connection");
                _context.Reviews.Remove(review);
                var reviewDeleted = await Save();
                if (reviewDeleted)
                {
                    try
                    {
                        await NotifyUser(transporterId, transporterConnectionId, "A review has been deleted!");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Notification error: {ex.Message}");
                        // Log or handle notification failure separately if desired
                    }

                }
                return reviewDeleted;
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
                .Include(r => r.Owner)
                .Where(r => r.OwnerId == ownerId)
                .ToListAsync();

            return _mapper.Map<ICollection<GetReviewDto>>(transporterReviews);
        }

        public async Task<ICollection<GetReviewDto>?> GetReviewsByTransporterId(int transporterId)
        {
            var transporterReviews = await _context.Reviews
                .Include(r => r.Owner)
                .Where(r => r.TransporterId == transporterId)
                .ToListAsync();
            return _mapper.Map<ICollection<GetReviewDto>>(transporterReviews);
        }

        public async Task<int> GetTransporterIdByReview(int reviewId)
        {
            var review = await _context.Reviews.FirstOrDefaultAsync(r => r.Id == reviewId);
            return review!.TransporterId;
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
            //Notification
            int transporterId = await GetTransporterIdByReview(reviewId);
            var db = _redis.GetDatabase();
            var transporterConnectionId = await db.StringGetAsync($"{transporterId}-connection");
            var reviewUpdates = await Save();
            if (reviewUpdates)
            {
                try
                {
                    await NotifyUser(transporterId, transporterConnectionId, "A review has been updated!");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Notification error: {ex.Message}");
                    // Log or handle notification failure separately if desired
                }
            }
            return reviewUpdates;
        }

        //Sentiment prediction function ---> Flask
        public async Task<string> PredictSentimentAsync(string text)
        {
            string? connectionFlask = Environment.GetEnvironmentVariable("FLASK_CONNECTION_STRING");
            if (connectionFlask == null)
            {
                throw new InvalidOperationException("The Flask_CONNECTION_STRING environment variable is not set.");
            }
            var flaskUrl = $"{connectionFlask}predict-sentiment";
            var requestData = new
            {
                text
            };

            try
            {
                // Convert request data to JSON
                var content = new StringContent(JsonSerializer.Serialize(requestData), Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync(flaskUrl, content);

                if (response.IsSuccessStatusCode)
                {
                    // Read the response content
                    var jsonResponse = await response.Content.ReadAsStringAsync();

                    // Parse JSON response
                    var jsonDocument = JsonDocument.Parse(jsonResponse);
                    var sentiment = jsonDocument.RootElement.GetProperty("sentiment").GetString();

                    // Return the sentiment from Flask API
                    return sentiment!;
                }
                else
                {
                    // Read the error response content
                    var errorResponse = await response.Content.ReadAsStringAsync();

                    // Parse the error message if it is JSON
                    var jsonDocument = JsonDocument.Parse(errorResponse);
                    var errorMessage = jsonDocument.RootElement.GetProperty("error").GetString();

                    // Return a properly formatted error message
                    return errorMessage!;
                }
            }
            catch (HttpRequestException e)
            {
                // Handle any HTTP-related errors
                Console.WriteLine($"HTTP Request Error: {e.Message}");
                return "An error occurred while connecting to the API.";
            }
            catch (JsonException e)
            {
                // Handle JSON parsing errors
                Console.WriteLine($"JSON Parsing Error: {e.Message}");
                return "An error occurred while processing the response.";
            }

            // return "neutral"; // Default response if no conditions are met
        }

        // Helper method for notification
        private async Task NotifyUser(int userId, string? connectionId, string content)
        {
            if (!string.IsNullOrEmpty(connectionId))
            {
                var sendNotificationDto = new SendNotificationDto
                {
                    UserId = userId,
                    Content = content,
                    ConnectionId = connectionId
                };
                await _notificationRepository.SendNotification(sendNotificationDto);
            }
            else
            {
                // ConnectionId is not present, save the notification to the database
                var notificationToStore = new CreateNotificationDto
                {
                    UserId = userId,
                    Content = content,
                };
                await _notificationRepository.AddNotification(notificationToStore);
            }
        }

    }
}