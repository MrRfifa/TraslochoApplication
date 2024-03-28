using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Dtos.ReviewsDto;
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


        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<GetReviewDto>))]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetReviews()
        {
            try
            {
                var reviews = await _reviewRepository.GetAllReviews();
                return Ok(new { status = "success", message = reviews });
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("error", ex.Message);
                return BadRequest(new { status = "fail", message = ModelState });
            }
        }


        [HttpGet("{reviewId}")]
        [ProducesResponseType(200, Type = typeof(GetReviewDto))]
        [ProducesResponseType(404)] // Changed from 400 to 404 for "Not Found"
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetReviewById(int reviewId)
        {
            try
            {
                var review = await _reviewRepository.GetReviewById(reviewId);
                if (review == null)
                    return NotFound(new { status = "fail", message = "Review not found" });

                return Ok(new { status = "success", message = review });
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("error", ex.Message);
                return BadRequest(new { status = "fail", message = ModelState });
            }
        }



        [HttpPost("create-review/{ownerId}/{transporterId}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> CreateReview([FromForm] CreateReviewDto reviewToCreate, int transporterId, int ownerId)
        {
            if (reviewToCreate == null)
                return BadRequest(new { status = "fail", message = "Review data is null." });

            if (!ModelState.IsValid)
                return BadRequest(new { status = "fail", message = ModelState });

            try
            {
                var reviewCreated = await _reviewRepository.CreateReview(reviewToCreate, transporterId, ownerId);

                if (!reviewCreated)
                {
                    return NotFound(new { status = "fail", message = "No completed shipments found." });
                }

                return Ok(new { status = "success", message = "Review created successfully." });
            }
            catch (ArgumentException ex)
            {
                ModelState.AddModelError("error", ex.Message);
                return BadRequest(new { status = "fail", message = ModelState });
            }
            catch (Exception)
            {
                ModelState.AddModelError("error", "Something went wrong while saving the review.");
                return StatusCode(500, ModelState);
            }
        }

        [HttpGet("reviews/{transporterId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<GetReviewDto>))]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetReviewsByTransporterId(int transporterId)
        {
            try
            {
                var reviews = await _reviewRepository.GetReviewsByTransporterId(transporterId);

                if (reviews == null)
                {
                    return BadRequest(new { status = "fail", message = "Transporter not found." });
                }

                return Ok(new { status = "success", message = reviews });
            }
            catch (Exception ex)
            {
                return BadRequest(new { status = "fail", message = ex.Message });
            }
        }

        [HttpPut("{reviewId}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> UpdateReview(int reviewId, CreateReviewDto reviewDto)
        {
            try
            {
                bool result = await _reviewRepository.UpdateReview(reviewId, reviewDto);
                if (result)
                {
                    return Ok(new { status = "success", message = "Review updated successfully." });
                }
                else
                {
                    return NotFound(new { status = "fail", message = "Review not found" });
                }
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception)
            {
                // Log the exception
                return StatusCode(500, "An error occurred while updating the review.");
            }
        }



        [HttpDelete("{reviewId}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> DeleteReview(int reviewId)
        {
            try
            {
                bool result = await _reviewRepository.DeleteReview(reviewId);
                if (result)
                {
                    return Ok(new { status = "success", message = "Review deleted successfully." });
                }
                else
                {
                    return NotFound(new { status = "fail", message = "Review not found" });
                }
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, ex.Message);
            }
        }


    }
}