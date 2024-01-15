using AutoMapper;
using Backend.Dtos.VehicleDtos;
using Backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Transporter")]
    public class VehicleController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IVehicleRepository _vehicleRepository;
        public VehicleController(IVehicleRepository vehicleRepository, IMapper mapper)
        {
            _vehicleRepository = vehicleRepository;
            _mapper = mapper;
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


        [HttpGet("vehicle/{vehicleId}")]
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

        [HttpPost("available/{vehicleId}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> MarkVehicleAsUnavailable(int vehicleId)
        {
            try
            {
                if (!await _vehicleRepository.VehicleExists(vehicleId))
                    return NotFound();

                if (!await _vehicleRepository.MarkVehicleAsUnavailable(vehicleId))
                {
                    ModelState.AddModelError("error", "Something went wrong updating the vehicle");
                    return BadRequest(new { status = "fail", message = ModelState });
                }
                return Ok(new { status = "success", message = "Vehicle is marked as unavailable successfully." });
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("error", ex.Message);
                return BadRequest(ModelState);
            }
        }

        [HttpPost("unavailable/{vehicleId}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> MarkVehicleAsAvailable(int vehicleId)
        {
            try
            {
                if (!await _vehicleRepository.VehicleExists(vehicleId))
                    return NotFound();

                if (!await _vehicleRepository.MarkVehicleAsAvailable(vehicleId))
                {
                    ModelState.AddModelError("error", "Something went wrong updating the vehicle");
                    return BadRequest(new { status = "fail", message = ModelState });
                }
                return Ok(new { status = "success", message = "Vehicle is marked as available successfully." });
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("error", ex.Message);
                return BadRequest(ModelState);
            }
        }

        [HttpPost("{transporterId}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> CreateVehicle([FromForm] CreateVehicleDto vehicleCreate, int transporterId)
        {
            if (vehicleCreate == null)
                return BadRequest(new { status = "fail", message = "Vehicle data is null." });

            if (!ModelState.IsValid)
                return BadRequest(new { status = "fail", message = ModelState });

            // Save the vehicle to the database
            if (!await _vehicleRepository.CreateVehicle(vehicleCreate, transporterId))
            {
                ModelState.AddModelError("error", "Something went wrong while saving the vehicle.");
                return StatusCode(500, ModelState);
            }

            return Ok(new { status = "success", message = "Vehicle created successfully." });
        }

        [HttpGet("transporter/{tranposrterId}")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<GetVehicleDto>))]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetVehiclesByTransporterId(int tranposrterId)
        {
            try
            {
                var vehicles = await _vehicleRepository.GetVehiclesByTransporterId(tranposrterId);
                var vehiclesDto = _mapper.Map<List<GetVehicleDto>>(vehicles);
                return Ok(new { status = "success", message = vehiclesDto });
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("error", ex.Message);
                return BadRequest(new { status = "fail", message = ModelState });
            }
        }

    }
}