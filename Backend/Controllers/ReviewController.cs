using Backend.DTOs.Review;
using Backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Owner")]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewRepository _reviewRepository;

        public ReviewController(IReviewRepository reviewRepository)
        {
            _reviewRepository = reviewRepository;
        }

        [HttpPost("create-review/{ownerId:int}/{transporterId:int}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> CreateReview([FromForm] CreateReviewDto reviewToCreate, int transporterId, int ownerId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState); // Handles invalid model state
            }

            // Call the service method to create the review
            var result = await _reviewRepository.CreateReview(reviewToCreate, transporterId, ownerId);

            if (result == 1)
            {
                return Ok(new { status = "success", message = "Review created successfully." });
            }
            if (result == -1)
            {
                return BadRequest(new { status = "fail", message = "Your review contains inappropriate language. Please respect others." });
            }

            return BadRequest(new { status = "fail", message = "Review creation failed. Ensure you have a completed shipment with this transporter." });
        }

        [HttpDelete("{reviewId:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)] // Success response
        [ProducesResponseType(StatusCodes.Status400BadRequest)] // Failure response
        [ProducesResponseType(401)]
        public async Task<IActionResult> DeleteReview(int reviewId)
        {
            var result = await _reviewRepository.DeleteReview(reviewId);

            if (result)
            {
                return Ok(new { status = "success", message = "Review deleted successfully." });
            }
            else
            {
                return BadRequest(new { status = "fail", message = "Review deletion failed. Review not found." });
            }
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<GetReviewDto>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetReviews()
        {
            try
            {
                var reviews = await _reviewRepository.GetAllReviews();

                if (reviews != null && reviews.Any())
                {
                    return Ok(new { status = "success", message = reviews });
                }
                else
                {
                    return Ok(new { status = "success", message = "No reviews found." });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { status = "fail", message = ex.Message });
            }
        }

        [HttpGet("{reviewId:int}")]
        [ProducesResponseType(200, Type = typeof(GetReviewDto))]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> GetReviewById(int reviewId)
        {
            try
            {
                var review = await _reviewRepository.GetReviewById(reviewId);
                if (review == null)
                {
                    return NotFound(new { status = "fail", message = "Review not found." });
                }

                return Ok(new { status = "success", message = review });
            }
            catch (Exception ex)
            {
                return BadRequest(new { status = "fail", message = ex.Message });
            }
        }

        [HttpGet("owner/{ownerId:int}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<GetReviewDto>))]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> GetReviewsByOwnerId(int ownerId)
        {
            try
            {
                var reviews = await _reviewRepository.GetReviewsByOwnerId(ownerId);

                if (reviews == null || !reviews.Any())
                {
                    return NotFound(new { status = "fail", message = "No reviews found for this owner." });
                }

                return Ok(new { status = "success", message = reviews });
            }
            catch (Exception ex)
            {
                return BadRequest(new { status = "fail", message = ex.Message });
            }
        }

        [HttpGet("transporter/{transporterId:int}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<GetReviewDto>))]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> GetReviewsByTransporterId(int transporterId)
        {
            try
            {
                var reviews = await _reviewRepository.GetReviewsByTransporterId(transporterId);

                if (reviews == null || !reviews.Any())
                {
                    return NotFound(new { status = "fail", message = "No reviews found for this owner." });
                }

                return Ok(new { status = "success", message = reviews });
            }
            catch (Exception ex)
            {
                return BadRequest(new { status = "fail", message = ex.Message });
            }
        }

        [HttpPut("{reviewId:int}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> UpdateReview(int reviewId, [FromBody] CreateReviewDto reviewDto)
        {
            try
            {
                var updated = await _reviewRepository.UpdateReview(reviewId, reviewDto);

                if (!updated)
                {
                    return NotFound(new { status = "fail", message = "Review not found." });
                }

                return Ok(new { status = "success", message = "Review updated successfully." });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { status = "fail", message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { status = "fail", message = ex.Message });
            }
        }


    }
}