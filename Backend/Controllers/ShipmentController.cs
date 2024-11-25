using System.ComponentModel.DataAnnotations;
using Backend.DTOs.Shipment;
using Backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Owner")]
    public class ShipmentController : ControllerBase
    {
        private readonly IShipmentRepository _shipmentRepository;
        public ShipmentController(IShipmentRepository shipmentRepository)
        {
            _shipmentRepository = shipmentRepository;
        }

        [HttpPut("cancel/{shipmentId:int}")]
        [ProducesResponseType(200)] // OK: Shipment canceled successfully
        [ProducesResponseType(400)] // Bad Request: Less than 3 days left for the shipment
        [ProducesResponseType(404)] // Not Found: Shipment not found
        [ProducesResponseType(500)] // Internal Server Error: Unexpected errors
        public async Task<IActionResult> CancelShipment(int shipmentId)
        {
            // Call the CancelShipment method in the service
            var result = await _shipmentRepository.CancelShipment(shipmentId);

            if (result == -1)
            {
                // Shipment not found
                return NotFound(new { message = "Shipment not found." });
            }
            else if (result == 0)
            {
                // Shipment cannot be canceled because it's less than 3 days away
                return BadRequest(new { message = "Invalid shipment cancel. The shipment can only be canceled if the difference is greater than 3 days." });
            }
            else if (result == 1)
            {
                // Shipment canceled successfully
                return Ok(new { message = "Shipment has been successfully canceled." });
            }
            else
            {
                // Handle unexpected cases
                return StatusCode(500, new { message = "An unexpected error occurred while canceling the shipment." });
            }
        }

        [HttpGet("{shipmentId:int}")]
        [ProducesResponseType(200, Type = typeof(GetShipmentDto))]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]

        public async Task<IActionResult> GetShipmentDtoById(int shipmentId)
        {
            var shipmentDto = await _shipmentRepository.GetShipmentDtoById(shipmentId);

            if (shipmentDto == null)
            {
                return NotFound(new { message = $"Shipment with ID {shipmentId:int} not found." });
            }

            return Ok(shipmentDto);
        }

        [HttpPut("update-date/{shipmentId:int}")]
        [ProducesResponseType(200)] // OK: Shipment date updated successfully
        [ProducesResponseType(400)] // Bad Request: Invalid shipment date update (less than 3 days)
        [ProducesResponseType(404)] // Not Found: Shipment not found
        [ProducesResponseType(401)] // Unauthorized: If authentication is required
        public async Task<IActionResult> ModifyShipmentDate(int shipmentId, [FromForm, Required] DateTime newDate)
        {
            var result = await _shipmentRepository.ModifyShipmentDate(shipmentId, newDate);

            if (result == -1)
            {
                // Shipment not found
                return NotFound(new { message = "Shipment with ID not found." });
            }
            else if (result == 0)
            {
                // Invalid shipment date update (less than 3 days)
                return BadRequest(new { message = "Invalid shipment date update. The shipment date can only be modified if the difference is greater than 3 days." });
            }
            else if (result == 1)
            {
                // Shipment date updated successfully
                return Ok(new { message = "Shipment date updated successfully." });
            }
            else
            {
                return StatusCode(500, new { message = "An unexpected error occurred." });
            }
        }

        [HttpPost("create/{ownerId:int}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> CreateShipment([FromForm] CreateShipmentDto shipmentToCreate, int ownerId)
        {
            try
            {
                var success = await _shipmentRepository.CreateShipment(shipmentToCreate, ownerId);

                if (!success)
                {
                    return BadRequest(new { status = "fail", message = "Failed to create shipment." });
                }
                return Ok(new { status = "success", message = "Shipment created successfully!" });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { status = "fail", message = ex.Message });
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("error", ex.Message);
                return BadRequest(new { status = "fail", message = ModelState });
            }
        }

        [HttpPost("add-addresses/{shipmentId:int}")]
        [ProducesResponseType(200)]  // Success
        [ProducesResponseType(404)]  // Shipment not found
        [ProducesResponseType(400)]  // Validation error
        public async Task<IActionResult> AddShipmentAddresses(int shipmentId, [FromForm] ShipmentAddressesDto shipmentAddressesDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { status = "fail", message = "Invalid data", errors = ModelState });
            }

            // Call service to add addresses
            var result = await _shipmentRepository.AddShipmentAddresses(shipmentId, shipmentAddressesDto.OriginAddress, shipmentAddressesDto.DestinationAddress);

            if (result == -1)
            {
                return NotFound(new { status = "fail", message = "Shipment not found" });
            }
            else if (result == -2)
            {
                return BadRequest(new { status = "fail", message = "Shipment has already addresses" });
            }
            else if (result == 1)
            {
                return Ok(new { status = "success", message = "Addresses added successfully" });
            }
            else
            {
                return BadRequest(new { status = "fail", message = "Failed to add shipment addresses" });
            }
        }

        [HttpGet("accepted/{ownerId:int}")]
        [ProducesResponseType(200)] // OK: Shipments retrieved successfully
        [ProducesResponseType(404)] // Not Found: No shipments found for the owner
        [ProducesResponseType(500)] // Internal Server Error: Unexpected errors
        public async Task<IActionResult> GetAcceptedShipmentsByOwnerId(int ownerId)
        {
            var shipments = await _shipmentRepository.GetAcceptedShipmentsByOwnerId(ownerId);

            if (shipments == null || shipments.Count == 0)
            {
                return NotFound(new { status = "fail", message = "No accepted shipments found for the specified owner." });
            }

            return Ok(new { status = "success", message = shipments });
        }

        [HttpGet("canceled/{ownerId:int}")]
        [ProducesResponseType(200)] // OK: Shipments retrieved successfully
        [ProducesResponseType(404)] // Not Found: No shipments found for the owner
        [ProducesResponseType(500)] // Internal Server Error: Unexpected errors
        public async Task<IActionResult> GetCanceledShipmentsByOwnerId(int ownerId)
        {
            var shipments = await _shipmentRepository.GetCanceledShipmentsByOwnerId(ownerId);

            if (shipments == null || shipments.Count == 0)
            {
                return NotFound(new { status = "fail", message = "No canceled shipments found for the specified owner." });
            }

            return Ok(new { status = "success", message = shipments });
        }

        [HttpGet("completed/{ownerId:int}")]
        [ProducesResponseType(200)] // OK: Shipments retrieved successfully
        [ProducesResponseType(404)] // Not Found: No shipments found for the owner
        [ProducesResponseType(500)] // Internal Server Error: Unexpected errors
        public async Task<IActionResult> GetCompletedShipmentsByOwnerId(int ownerId)
        {
            var shipments = await _shipmentRepository.GetCompletedShipmentsByOwnerId(ownerId);

            if (shipments == null || shipments.Count == 0)
            {
                return NotFound(new { status = "fail", message = "No completed shipments found for the specified owner." });
            }

            return Ok(new { status = "success", message = shipments });
        }

        [HttpGet("pending/{ownerId:int}")]
        [ProducesResponseType(200)] // OK: Shipments retrieved successfully
        [ProducesResponseType(404)] // Not Found: No shipments found for the owner
        [ProducesResponseType(500)] // Internal Server Error: Unexpected errors
        public async Task<IActionResult> GetPendingCompletedDataShipmentsByOwnerId(int ownerId)
        {
            var shipments = await _shipmentRepository.GetPendingCompletedDataShipmentsByOwnerId(ownerId);

            if (shipments == null || shipments.Count == 0)
            {
                return NotFound(new { status = "fail", message = "No pending shipments found for the specified owner." });
            }

            return Ok(new { status = "success", message = shipments });
        }

        [HttpGet("uncompleted-data/{ownerId:int}")]
        [ProducesResponseType(200)] // OK: Shipments retrieved successfully
        [ProducesResponseType(404)] // Not Found: No shipments found for the owner
        [ProducesResponseType(500)] // Internal Server Error: Unexpected errors
        public async Task<IActionResult> GetUnCompletedDataShipmentsByOwnerId(int ownerId)
        {
            var shipments = await _shipmentRepository.GetUncompletedDataShipmentsByOwnerId(ownerId);

            if (shipments == null || shipments.Count == 0)
            {
                return NotFound(new { status = "fail", message = "No pending shipments found for the specified owner." });
            }

            return Ok(new { status = "success", message = shipments });
        }


        [HttpPut("mark-shipment-completed/{shipmentId:int}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> MarkShipmentAsCompleted(int shipmentId)
        {
            try
            {
                var result = await _shipmentRepository.MarkShipmentAsCompleted(shipmentId);

                if (result == -1)
                {
                    return NotFound(new { status = "fail", message = "Shipment not found." });
                }

                if (result == 0)
                {
                    return BadRequest(new { status = "fail", message = "Shipment is already completed." });
                }

                if (result == -2)
                {
                    return BadRequest(new { status = "fail", message = "Shipment can't be marked as completed, dates problem." });
                }

                return Ok(new { status = "success", message = "Shipment marked as completed successfully!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { status = "fail", message = ex.Message });
            }
        }

        [HttpGet("get-shipment-addresses/{shipmentId:int}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]

        public async Task<IActionResult> GetShipmentAddresses(int shipmentId)
        {
            var addresses = await _shipmentRepository.GetShipmentAddresses(shipmentId);
            if (addresses == null)
            {
                return NotFound(new { status = "fail", message = "Shipment not found or no addresses available." });
            }

            return Ok(new { status = "success", data = addresses });
        }

        [HttpGet("get-shipment-images/{shipmentId:int}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> GetShipmentAndImages(int shipmentId)
        {
            var images = await _shipmentRepository.GetShipmentAndImages(shipmentId);
            if (images == null || !images.Any())
            {
                return NotFound(new { status = "fail", message = "Shipment not found or no images available." });
            }

            return Ok(new { status = "success", data = images });
        }

    }
}