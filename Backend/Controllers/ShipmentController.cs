using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Backend.Dtos.Shipment;
using Backend.Dtos.TransporterDto;
using Backend.Dtos.VehicleDtos;
using Backend.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ShipmentController : ControllerBase
    {
        private readonly IShipmentRepository _shipmentRepository;
        private readonly IMapper _mapper;
        public ShipmentController(IShipmentRepository shipmentRepository, IMapper mapper)
        {
            _mapper = mapper;
            _shipmentRepository = shipmentRepository;

        }

        [HttpGet("get-available-vehicles")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<GetVehicleDto>))]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetAvailableVehicles([FromQuery] DateTime? shipmentDate)
        {
            try
            {
                var vehicles = await _shipmentRepository.GetAvailableVehicles(shipmentDate ?? DateTime.Now);

                return Ok(new { status = "success", message = vehicles });
            }
            catch (Exception)
            {
                // Log the exception details

                ModelState.AddModelError("Error", "An error occurred while retrieving data.");
                return BadRequest(new { status = "fail", message = ModelState });
            }
        }


        [HttpGet("get-available-transporters")]
        [ProducesResponseType(200, Type = typeof(IEnumerable<GetTransporterDto>))]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetTransportersWithAvailableVehicles([FromQuery] DateTime? shipmentDate)
        {
            try
            {
                var transporters = await _shipmentRepository.GetTransportersWithAvailableVehicles(shipmentDate ?? DateTime.Now);

                return Ok(new { status = "success", message = transporters });
            }
            catch (Exception)
            {
                // Log the exception details

                ModelState.AddModelError("Error", "An error occurred while retrieving data.");
                return BadRequest(new { status = "fail", message = ModelState });
            }
        }

        [HttpPost("create-shipment")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> CreateShipment([FromForm] CreateShipmentDto shipmentToCreate, int transporterId, int ownerId, int transporterVehicleId)
        {
            try
            {
                var success = await _shipmentRepository.CreateShipment(shipmentToCreate, transporterId, ownerId, transporterVehicleId);

                if (success)
                {
                    return Ok(new { status = "success", message = "Shipment created successfully!" });
                }
                else
                {
                    return BadRequest(new { status = "fail", message = "Failed to create shipment." });
                }
            }
            catch (Exception ex)
            {
                // Log the exception details

                ModelState.AddModelError("Error", ex.Message);
                return BadRequest(new { status = "fail", message = ModelState });
            }
        }

        // [HttpGet("{id}")]
        // [ProducesResponseType(200, Type = typeof(Shipment))]
        // [ProducesResponseType(404)]
        // [ProducesResponseType(401)]
        // public async Task<IActionResult> GetShipmentById(int id)
        // {
        //     var shipment = await _shipmentRepository.GetShipmentById(id);

        //     if (shipment == null)
        //     {
        //         return NotFound(new { status = "fail", message = "Shipment not found." });
        //     }

        //     return Ok(new { status = "success", message = shipment });
        // }



    }
}