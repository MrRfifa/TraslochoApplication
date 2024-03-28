using Backend.Dtos.RequestDto;
using Backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RequestController : ControllerBase
    {
        private readonly IRequestRepository _requestRepository;

        public RequestController(IRequestRepository requestRepository)
        {
            _requestRepository = requestRepository;
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<GetRequestDto>))]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        [Authorize]
        public async Task<IActionResult> GetRequests()
        {
            try
            {
                var requests = await _requestRepository.GetAllRequests();
                return Ok(new { status = "success", message = requests });
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("error", ex.Message);
                return BadRequest(new { status = "fail", message = ModelState });
            }
        }

        [HttpGet("{requestId}")]
        [ProducesResponseType(200, Type = typeof(GetRequestDto))]
        [ProducesResponseType(404)] // Changed from 400 to 404 for "Not Found"
        [ProducesResponseType(401)]
        [Authorize]
        public async Task<IActionResult> GetRequestById(int requestId)
        {
            try
            {
                var request = await _requestRepository.GetRequestById(requestId);
                if (request == null)
                    return NotFound(new { status = "fail", message = "Request not found" });

                return Ok(new { status = "success", message = request });
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("error", ex.Message);
                return BadRequest(new { status = "fail", message = ModelState });
            }
        }

        [HttpPost("create-request/{shipmentId}/{transporterId}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        [Authorize(Roles = "Transporter")]
        public async Task<IActionResult> CreateRequest(int shipmentId, int transporterId)
        {
            try
            {
                var requestCreated = await _requestRepository.CreateRequest(transporterId, shipmentId);

                return Ok(new { status = "success", message = "Request sent successfully." });
            }
            catch (ArgumentException ex)
            {
                // ModelState.AddModelError("error", ex.Message);
                return BadRequest(new { status = "fail", message = ex.Message });
            }
        }


        [HttpGet("requests/by-transporter/{transporterId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<GetRequestDto>))]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        [Authorize(Roles = "Transporter")]
        public async Task<IActionResult> GetRequestsByTransporterId(int transporterId)
        {
            try
            {
                var requests = await _requestRepository.GetRequestsByTransporterId(transporterId);

                if (requests == null)
                {
                    return BadRequest(new { status = "fail", message = "Transporter not found." });
                }

                return Ok(new { status = "success", message = requests });
            }
            catch (Exception ex)
            {
                return BadRequest(new { status = "fail", message = ex.Message });
            }
        }

        [HttpGet("requests/by-shipment/{shipmentId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<GetRequestDto>))]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        [Authorize(Roles = "Owner")]
        public async Task<IActionResult> GetRequestsByShipmentId(int shipmentId)
        {
            try
            {
                var requests = await _requestRepository.GetRequestsByShipmentId(shipmentId);

                if (requests == null)
                {
                    return BadRequest(new { status = "fail", message = "Shipment not found." });
                }

                return Ok(new { status = "success", message = requests });
            }
            catch (Exception ex)
            {
                return BadRequest(new { status = "fail", message = ex.Message });
            }
        }

        [HttpDelete("{requestId}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        [ProducesResponseType(500)]
        [Authorize(Roles = "Transporter")]
        public async Task<IActionResult> DeleteRequest(int requestId)
        {
            try
            {
                bool result = await _requestRepository.DeleteRequest(requestId);
                if (result)
                {
                    return Ok(new { status = "success", message = "Request deleted successfully." });
                }
                else
                {
                    return NotFound(new { status = "fail", message = "Request not found" });
                }
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, ex.Message);
            }
        }


        [HttpPost("requests/{requestId}/accept")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        [ProducesResponseType(500)]
        [Authorize(Roles = "Owner")]
        public async Task<IActionResult> AcceptRequest(int requestId)
        {
            try
            {
                var accepted = await _requestRepository.AcceptRequest(requestId);

                if (accepted)
                {
                    return Ok(new { status = "success", message = "Request accepted successfully." });
                }
                else
                {
                    return NotFound(new { status = "fail", message = "Request not found." });
                }
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { status = "fail", message = "An error occurred while processing the request.", error = ex.Message });
            }
        }



    }
}