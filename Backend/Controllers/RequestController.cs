using Backend.DTOs.Request;
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

        [HttpGet("requests-by-transporter/{transporterId:int}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<GetRequestDto>))]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        [Authorize(Roles = "Transporter")]
        public async Task<IActionResult> GetRequestsByTransporterId(int transporterId)
        {
            try
            {
                var requests = await _requestRepository.GetRequestsByTransporterId(transporterId);

                if (requests == null)
                {
                    return NotFound(new { status = "fail", message = "Transporter not found." });
                }

                return Ok(new { status = "success", message = requests });
            }
            catch (Exception)
            {
                return BadRequest(new { status = "fail", message = "An error occurred while fetching requests." });
            }
        }

        [HttpGet("requests-by-shipment/{shipmentId:int}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<GetRequestDto>))]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        [Authorize(Roles = "Owner")]
        public async Task<IActionResult> GetRequestsByShipmentId(int shipmentId)
        {
            try
            {
                var requests = await _requestRepository.GetRequestsByShipmentId(shipmentId);

                if (requests == null)
                {
                    return NotFound(new { status = "fail", message = "Transporter not found." });
                }

                return Ok(new { status = "success", message = requests });
            }
            catch (Exception)
            {
                return BadRequest(new { status = "fail", message = "An error occurred while fetching requests." });
            }
        }

        [HttpGet("{requestId:int}")]
        [ProducesResponseType(200, Type = typeof(GetRequestDto))]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        [Authorize]
        public async Task<IActionResult> GetRequestById(int requestId)
        {
            try
            {
                var requestDto = await _requestRepository.GetRequestById(requestId);

                if (requestDto == null)
                {
                    return NotFound(new { status = "fail", message = "Request not found." });
                }

                return Ok(new { status = "success", message = requestDto });
            }
            catch (Exception)
            {
                // Log the error (optional)
                return BadRequest(new { status = "fail", message = "An error occurred while fetching the request." });
            }
        }

        [HttpGet("requests")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<GetRequestDto>))]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        [Authorize]
        public async Task<IActionResult> GetAllRequests()
        {
            try
            {
                var requests = await _requestRepository.GetAllRequests();

                return Ok(new { status = "success", message = requests });
            }
            catch (Exception)
            {
                return BadRequest(new { status = "fail", message = "An error occurred while fetching requests." });
            }
        }

        [HttpDelete("{requestId:int}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        [Authorize(Roles = "Transporter")]
        public async Task<IActionResult> DeleteRequest(int requestId)
        {
            try
            {
                bool deleted = await _requestRepository.DeleteRequest(requestId);

                if (!deleted)
                {
                    return NotFound(new { status = "fail", message = "Request not found." });
                }

                return Ok(new { status = "fail", message = "Request deleted successfully." }); // Successfully deleted
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { status = "fail", message = ex.Message });
            }
            catch (Exception)
            {
                return BadRequest(new { status = "fail", message = "An error occurred while deleting the request." });
            }
        }

        [HttpPost]
        [ProducesResponseType(200, Type = typeof(GetRequestDto))]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [Authorize(Roles = "Transporter")]
        public async Task<IActionResult> CreateRequest([FromBody] CreateRequestDto createRequestDto)
        {
            try
            {
                // Call the repository method to create the request
                bool created = await _requestRepository.CreateRequest(createRequestDto.TransporterId, createRequestDto.ShipmentId);

                if (!created)
                {
                    return BadRequest(new { status = "fail", message = "Failed to create the request." });
                }

                return Ok(new { status = "success", message = "Request created successfully." });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { status = "fail", message = ex.Message });
            }
            catch (Exception)
            {
                // Log the error (optional)
                return BadRequest(new { status = "fail", message = "An error occurred while creating the request." });
            }
        }

        [HttpPost("accept/{requestId:int}")]
        [ProducesResponseType(200, Type = typeof(GetRequestDto))]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [Authorize(Roles = "Owner")]
        public async Task<IActionResult> AcceptRequest(int requestId)
        {
            try
            {
                // Call the repository method to accept the request
                bool accepted = await _requestRepository.AcceptRequest(requestId);
                if (!accepted)
                {
                    return BadRequest(new { status = "fail", message = "Failed to accept the request." });
                }

                return Ok(new { status = "success", message = "Request accepted successfully." });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { status = "fail", message = ex.Message });
            }
            catch (Exception)
            {
                return BadRequest(new { status = "fail", message = "An error occurred while accepting the request." });
            }
        }

        [HttpGet("transporter/{transporterId:int}/shipment/{shipmentId:int}/exists")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        [Authorize]
        public async Task<IActionResult> TransporterHasRequestForShipment(int transporterId, int shipmentId)
        {
            try
            {
                var hasRequest = await _requestRepository.TransporterHasRequestForShipment(transporterId, shipmentId);
                return Ok(new { status = "success", message = hasRequest });
            }
            catch (Exception)
            {
                return BadRequest(new { status = "fail", message = "An error occurred while fetching requests." });
            }
        }


        [HttpGet("transporter/{transporterId:int}/shipment/{shipmentId:int}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        [Authorize]
        public async Task<IActionResult> GetRequestByTransporterAndShipment(int transporterId, int shipmentId)
        {
            try
            {
                var request = await _requestRepository.GetRequestByTransporterAndShipment(transporterId, shipmentId);
                if (request == null)
                {
                    return NotFound(new
                    {
                        status = "fail",
                        message = "No request found for the given transporter and shipment."
                    });
                }
                return Ok(new { status = "success", message = request });
            }
            catch (Exception)
            {
                return BadRequest(new { status = "fail", message = "An error occurred while fetching requests." });
            }
        }



    }
}