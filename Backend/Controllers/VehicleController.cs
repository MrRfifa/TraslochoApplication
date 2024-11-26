using AutoMapper;
using Backend.DTOs.Vehicle;
using Backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class VehicleController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IVehicleRepository _vehicleRepository;
        public VehicleController(IVehicleRepository vehicleRepository, IMapper mapper)
        {
            _vehicleRepository = vehicleRepository;
            _mapper = mapper;
        }

        [HttpPost("{transporterId:int}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> CreateVehicle([FromForm] CreateVehicleDto vehicleCreate, int transporterId)
        {
            if (vehicleCreate == null)
                return BadRequest(new { status = "fail", message = "Vehicle data is null." });

            if (!ModelState.IsValid)
                return BadRequest(new { status = "fail", message = ModelState });

            try
            {
                // Save the vehicle to the database
                bool created = await _vehicleRepository.CreateVehicle(vehicleCreate, transporterId);

                if (!created)
                {
                    return BadRequest(new { status = "fail", message = "User already has a vehicle registered." });
                }

                return Ok(new { status = "success", message = "Vehicle created successfully." });
            }
            catch (Exception)
            {
                // Log the exception or handle it appropriately
                return StatusCode(500, new { status = "fail", message = "An error occurred while creating the vehicle." });
            }
        }

        [HttpGet]
        [ProducesResponseType(200, Type = typeof(IEnumerable<GetVehicleDto>))]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetVehicles()
        {
            try
            {
                var vehicles = await _vehicleRepository.GetVehicles();
                // var vehicleDtos = _mapper.Map<List<GetVehicleDto>>(vehicles);

                return Ok(new { status = "success", message = vehicles });
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("error", ex.Message);
                return BadRequest(new { status = "fail", message = ModelState });
            }
        }

        [HttpGet("vehicle/{vehicleId:int}")]
        [ProducesResponseType(200, Type = typeof(GetVehicleDto))]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetVehicleById(int vehicleId)
        {
            try
            {
                if (!await _vehicleRepository.VehicleExists(vehicleId))
                    return NotFound();
                var vehicle = await _vehicleRepository.GetVehicleById(vehicleId);
                var vehicleDto = _mapper.Map<GetVehicleDto>(vehicle);
                return Ok(new { status = "success", message = vehicleDto });
            }

            catch (Exception ex)
            {
                ModelState.AddModelError("error", ex.Message);
                return BadRequest(new { status = "fail", message = ModelState });
            }
        }

        [HttpPut("unavailable/{vehicleId:int}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> MarkVehicleAsUnavailable(int vehicleId)
        {
            // Check if the vehicle exists
            if (!await _vehicleRepository.VehicleExists(vehicleId))
                return NotFound(new { status = "fail", message = "Vehicle not found" });

            // Check if the vehicle is already available
            bool isVehicleAvailable = await _vehicleRepository.VehicleIsAvailable(vehicleId);
            if (!isVehicleAvailable)
            {
                return BadRequest(new { status = "fail", message = "Vehicle is already unavailable" });
            }

            // Attempt to mark the vehicle as available
            bool updateSuccess = await _vehicleRepository.MarkVehicleAsUnavailable(vehicleId);
            if (!updateSuccess)
            {
                return StatusCode(500, new { status = "error", message = "Something went wrong updating the vehicle" });
            }

            // If successful, return an OK response
            return Ok(new { status = "success", message = "Vehicle marked as unavailable successfully." });
        }

        [HttpPut("available/{vehicleId:int}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> MarkVehicleAsAvailable(int vehicleId)
        {
            // Check if the vehicle exists
            if (!await _vehicleRepository.VehicleExists(vehicleId))
                return NotFound(new { status = "fail", message = "Vehicle not found" });

            // Check if the vehicle is already available
            bool isVehicleAvailable = await _vehicleRepository.VehicleIsAvailable(vehicleId);
            if (isVehicleAvailable)
            {
                return BadRequest(new { status = "fail", message = "Vehicle is already available" });
            }

            // Attempt to mark the vehicle as available
            bool updateSuccess = await _vehicleRepository.MarkVehicleAsAvailable(vehicleId);
            if (!updateSuccess)
            {
                return StatusCode(500, new { status = "error", message = "Something went wrong updating the vehicle" });
            }

            // If successful, return an OK response
            return Ok(new { status = "success", message = "Vehicle marked as available successfully." });
        }

        [HttpGet("transporter/{transporterId:int}")]
        [ProducesResponseType(200, Type = typeof(GetVehicleDto))]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetVehicleByTransporterId(int transporterId)
        {
            try
            {
                var vehicle = await _vehicleRepository.GetVehicleByTransporterId(transporterId);
                var vehicleDto = _mapper.Map<GetVehicleDto>(vehicle);
                return Ok(new { status = "success", message = vehicleDto });
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("error", ex.Message);
                return BadRequest(new { status = "fail", message = ModelState });
            }
        }

        [HttpPut("{vehicleId:int}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> UpdateVehicle(int vehicleId, [FromForm] UpdateVehicleDto updateDto)
        {
            if (updateDto == null)
            {
                return BadRequest(new { status = "fail", message = "Update data is null." });
            }

            try
            {
                bool updated = await _vehicleRepository.UpdateVehicle(vehicleId, updateDto);

                if (!updated)
                {
                    return NotFound(new { status = "fail", message = "Vehicle not found." });
                }

                return Ok(new { status = "success", message = "Vehicle updated successfully." });
            }
            catch (Exception)
            {
                // Log the exception or handle it appropriately
                return StatusCode(500, new { status = "fail", message = "An error occurred while updating the vehicle." });
            }
        }

        [HttpPut("images/{vehicleId:int}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> UpdateVehicleImages(int vehicleId, [FromForm] UpdateVehicleImagesDto updateDto)
        {
            if (updateDto == null)
            {
                return BadRequest(new { status = "fail", message = "Update data is null." });
            }

            try
            {
                bool updated = await _vehicleRepository.UpdateVehicleImages(vehicleId, updateDto);

                if (!updated)
                {
                    return NotFound(new { status = "fail", message = "Vehicle not found." });
                }

                return Ok(new { status = "success", message = "Vehicle updated successfully." });
            }
            catch (Exception ex)
            {
                // Log the exception or handle it appropriately
                return StatusCode(500, new { status = "fail", message = ex });
            }
        }

    }
}