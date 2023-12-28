using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Backend.Dtos;
using Backend.Dtos.Shipment;
using Backend.Dtos.TransporterDto;
using Backend.Dtos.VehicleDtos;
using Backend.Interfaces;
using Backend.Models.classes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

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
        // [Authorize(Roles = "Owner")]
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
        // [ProducesResponseType(200, Type = typeof(ICollection<Transporter>))]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        // [Authorize(Roles = "Owner")]
        public async Task<IActionResult> GetTransportersWithAvailableVehicles([FromQuery] DateTime? shipmentDate)
        {
            try
            {
                IEnumerable<GetTransporterDto>? transporters = await _shipmentRepository.GetTransportersWithAvailableVehicles(shipmentDate ?? DateTime.Now);

                return Ok(new { status = "success", message = transporters });
            }
            catch (Exception ex)
            {
                // Log the exception details

                ModelState.AddModelError("Error", ex.Message);
                return BadRequest(new { status = "fail", message = ModelState });
            }
        }

        [HttpPost("create-shipment")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        [Authorize(Roles = "Owner")]
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

        [HttpGet("{shipmentId}")]
        [ProducesResponseType(200, Type = typeof(GetShipmentDto))]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        [Authorize(Roles = "Owner")]
        public async Task<IActionResult> GetShipmentDtoById(int shipmentId)
        {
            try
            {
                var shipment = await _shipmentRepository.GetShipmentById(shipmentId);

                return Ok(new { status = "success", message = shipment });
            }
            catch (Exception)
            {
                return NotFound(new { status = "fail", message = "Shipment not found." });
            }
        }


        [HttpPost("modify-price/{shipmentId}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        [Authorize]
        public async Task<IActionResult> NegotiatePrice(int shipmentId, [FromForm, Required] int newPrice)
        {
            var success = await _shipmentRepository.NegociatePrice(shipmentId, newPrice);

            if (!success)
            {
                return NotFound(new { status = "fail", message = "Shipment not found." });
            }

            return NoContent();
        }

        [HttpPost("accept/{shipmentId}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        [Authorize(Roles = "Transporter")]
        public async Task<IActionResult> AcceptShipment(int shipmentId, [FromForm, Required] int transporterId)
        {
            try
            {
                var success = await _shipmentRepository.AcceptShipment(shipmentId, transporterId);

                return Ok(new { status = "success", message = "Shipment accepted with success" });
            }
            catch (Exception ex)
            {
                return NotFound(new { status = "fail", message = ex.Message });
            }
        }

        [HttpPost("cancel/{shipmentId}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        [Authorize]
        public async Task<IActionResult> CancelShipment(int shipmentId)
        {
            try
            {
                var success = await _shipmentRepository.CancelShipment(shipmentId);

                return Ok(new { status = "success", message = "Shipment canceled with success" });
            }
            catch (Exception ex)
            {
                return NotFound(new { status = "fail", message = ex.Message });
            }
        }

        [HttpPost("update-date/{shipmentId}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        [Authorize]
        public async Task<IActionResult> ModifyShipmentDate(int shipmentId, [FromForm, Required] DateTime newDate)
        {
            try
            {
                var success = await _shipmentRepository.ModifyShipmentDate(shipmentId, newDate);

                return Ok(new { status = "success", message = "Shipment date updated successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { status = "fail", message = ex.Message });
            }
        }

        [HttpGet("search-transporters")]
        [ProducesResponseType(200, Type = typeof(GetShipmentDto))]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        [Authorize(Roles = "Owner")]
        public async Task<IActionResult> SearchTransporters(SearchCriteria criteria)
        {
            List<Transporter>? matchedTransporters = await _shipmentRepository.MatchTransporters(criteria);

            return Ok(matchedTransporters);
        }

    }
}