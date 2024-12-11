using Backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class StatisticController : ControllerBase
    {
        private readonly IUserStatisticsRepository _userStatistics;
        public StatisticController(IUserStatisticsRepository userStatistics)
        {
            _userStatistics = userStatistics;
        }

        [HttpGet("expenses/{ownerId:int}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]  // Bad Request
        [ProducesResponseType(422)]  // Unprocessable Entity
        [ProducesResponseType(500)]  // Internal Server Error
        public async Task<IActionResult> GetOwnerTotalExpenses(int ownerId)
        {
            try
            {
                var totalExpenses = await _userStatistics.GetTotalExpenses(ownerId);

                return Ok(new
                {
                    status = "success",
                    message = "Total expenses retrieved successfully.",
                    data = new
                    {
                        OwnerId = ownerId,
                        TotalExpenses = totalExpenses
                    }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    status = "fail",
                    message = "Failed to retrieve total expenses.",
                    error = ex.Message
                });
            }
        }

        [HttpGet("revenues/{transporterId:int}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]  // Bad Request
        [ProducesResponseType(422)]  // Unprocessable Entity
        [ProducesResponseType(500)]  // Internal Server Error
        public async Task<IActionResult> GetTransporterTotalRevenues(int transporterId)
        {
            try
            {
                var totalRevenues = await _userStatistics.GetTotalRevenues(transporterId);

                return Ok(new
                {
                    status = "success",
                    message = "Total expenses retrieved successfully.",
                    data = new
                    {
                        TransporterId = transporterId,
                        TotalRevenues = totalRevenues
                    }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    status = "fail",
                    message = "Failed to retrieve total expenses.",
                    error = ex.Message
                });
            }
        }

        [HttpGet("total-shipments/{ownerId:int}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]  // Bad Request
        [ProducesResponseType(422)]  // Unprocessable Entity
        [ProducesResponseType(500)]  // Internal Server Error
        public async Task<IActionResult> GetTotalNumberOfShipments(int ownerId)
        {
            try
            {
                var totalNumberShipments = await _userStatistics.GetTotalNumberOfShipments(ownerId);

                return Ok(new
                {
                    status = "success",
                    message = "Total expenses retrieved successfully.",
                    data = new
                    {
                        OwnerId = ownerId,
                        TotalShipments = totalNumberShipments
                    }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    status = "fail",
                    message = "Failed to retrieve total expenses.",
                    error = ex.Message
                });
            }
        }

        [HttpGet("total-requests/{transporterId:int}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]  // Bad Request
        [ProducesResponseType(422)]  // Unprocessable Entity
        [ProducesResponseType(500)]  // Internal Server Error
        public async Task<IActionResult> GetTotalNumberOfRequests(int transporterId)
        {
            try
            {
                var totalNumberRequests = await _userStatistics.GetTotalNumberOfRequests(transporterId);

                return Ok(new
                {
                    status = "success",
                    message = "Total expenses retrieved successfully.",
                    data = new
                    {
                        TransporterId = transporterId,
                        TotalRequests = totalNumberRequests
                    }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    status = "fail",
                    message = "Failed to retrieve total expenses.",
                    error = ex.Message
                });
            }
        }

        [HttpGet("total-distance/{userId:int}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]  // Bad Request
        [ProducesResponseType(422)]  // Unprocessable Entity
        [ProducesResponseType(500)]  // Internal Server Error
        public async Task<IActionResult> GetTotalDistance(int userId)
        {
            try
            {
                var totalDistance = await _userStatistics.GetTotalDistance(userId);

                return Ok(new
                {
                    status = "success",
                    message = "Total expenses retrieved successfully.",
                    data = new
                    {
                        UserId = userId,
                        TotalDistance = totalDistance
                    }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    status = "fail",
                    message = "Failed to retrieve total expenses.",
                    error = ex.Message
                });
            }
        }

        [HttpGet("shipment-status/{userId:int}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]  // Bad Request
        [ProducesResponseType(422)]  // Unprocessable Entity
        [ProducesResponseType(500)]  // Internal Server Error
        public async Task<IActionResult> GetShipmentStatus(int userId)
        {
            try
            {
                var shipmentStatus = await _userStatistics.GetShipmentStatus(userId);

                if (shipmentStatus == null)
                {
                    return NotFound(new
                    {
                        Status = "fail",
                        Message = "Shipment status not found for the given user ID."
                    });
                }

                return Ok(new
                {
                    Status = "success",
                    Message = "Shipment status retrieved successfully.",
                    Data = shipmentStatus
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Status = "fail",
                    Message = "An error occurred while retrieving data.",
                    Error = ex.Message
                });
            }
        }

        [HttpGet("sentiment-status/{userId:int}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]  // Bad Request
        [ProducesResponseType(422)]  // Unprocessable Entity
        [ProducesResponseType(500)]  // Internal Server Error
        public async Task<IActionResult> GetSentimentStatus(int userId)
        {
            try
            {
                var sentimentStatus = await _userStatistics.GetSentimentNumbers(userId);

                if (sentimentStatus == null)
                {
                    return NotFound(new
                    {
                        Status = "fail",
                        Message = "Shipment status not found for the given user ID."
                    });
                }

                return Ok(new
                {
                    Status = "success",
                    Message = "Shipment status retrieved successfully.",
                    Data = sentimentStatus
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Status = "fail",
                    Message = "An error occurred while retrieving data.",
                    Error = ex.Message
                });
            }
        }


        [HttpGet("revenues-month/{transporterId:int}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]  // Bad Request
        [ProducesResponseType(422)]  // Unprocessable Entity
        [ProducesResponseType(500)]  // Internal Server Error
        public async Task<IActionResult> GetRevenuesPerMonth(int transporterId)
        {
            try
            {
                var revenuesMonth = await _userStatistics.GetRevenuesPerMonth(transporterId);

                if (revenuesMonth == null)
                {
                    return NotFound(new
                    {
                        Status = "fail",
                        Message = "Revenues Per Month not found for the given user ID."
                    });
                }

                return Ok(new
                {
                    Status = "success",
                    Message = "Revenues Per Month retrieved successfully.",
                    Data = revenuesMonth
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Status = "fail",
                    Message = "An error occurred while retrieving data.",
                    Error = ex.Message
                });
            }
        }


        [HttpGet("expenses-month/{ownerId:int}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]  // Bad Request
        [ProducesResponseType(422)]  // Unprocessable Entity
        [ProducesResponseType(500)]  // Internal Server Error
        public async Task<IActionResult> GetExpensesPerMonth(int ownerId)
        {
            try
            {
                var expensesMonth = await _userStatistics.GetExpensesPerMonth(ownerId);

                if (expensesMonth == null)
                {
                    return NotFound(new
                    {
                        Status = "fail",
                        Message = "Expenses Per Month not found for the given user ID."
                    });
                }

                return Ok(new
                {
                    Status = "success",
                    Message = "Expenses Per Month retrieved successfully.",
                    Data = expensesMonth
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Status = "fail",
                    Message = "An error occurred while retrieving data.",
                    Error = ex.Message
                });
            }
        }

        [HttpGet("shipments-month/{userId:int}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]  // Bad Request
        [ProducesResponseType(422)]  // Unprocessable Entity
        [ProducesResponseType(500)]  // Internal Server Error
        public async Task<IActionResult> GetNumberOfShipmentsPerMonth(int userId)
        {
            try
            {
                var shipmentsMonth = await _userStatistics.GetNumberOfShipmentsPerMonth(userId);

                if (shipmentsMonth == null)
                {
                    return NotFound(new
                    {
                        Status = "fail",
                        Message = "Shipments Per Month not found for the given user ID."
                    });
                }

                return Ok(new
                {
                    Status = "success",
                    Message = "Shipments Per Month retrieved successfully.",
                    Data = shipmentsMonth
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Status = "fail",
                    Message = "An error occurred while retrieving data.",
                    Error = ex.Message
                });
            }
        }

        [HttpGet("completed-shipments/{userId:int}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]  // Bad Request
        [ProducesResponseType(422)]  // Unprocessable Entity
        [ProducesResponseType(500)]  // Internal Server Error
        public async Task<IActionResult> GetNumberOfCompletedShipments(int userId)
        {
            try
            {
                var completedShipments = await _userStatistics.GetNumberOfCompletedShipments(userId);

                return Ok(new
                {
                    status = "success",
                    message = "Total expenses retrieved successfully.",
                    data = new
                    {
                        UserId = userId,
                        ComletedShipments = completedShipments
                    }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    status = "fail",
                    message = "Failed to retrieve total expenses.",
                    error = ex.Message
                });
            }
        }

        [HttpGet("owner-statistics/{ownerId:int}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]  // Bad Request
        [ProducesResponseType(422)]  // Unprocessable Entity
        [ProducesResponseType(500)]  // Internal Server Error
        [Authorize(Roles = "Owner")]
        public async Task<IActionResult> GetOwnerStatistics(int ownerId)
        {
            try
            {
                // Retrieve all statistics
                var totalExpenses = await _userStatistics.GetTotalExpenses(ownerId);
                var totalNumberShipments = await _userStatistics.GetTotalNumberOfShipments(ownerId);
                var totalDistance = await _userStatistics.GetTotalDistance(ownerId);
                var shipmentStatus = await _userStatistics.GetShipmentStatus(ownerId);
                var sentimentStatus = await _userStatistics.GetSentimentNumbers(ownerId);
                var expensesPerMonth = await _userStatistics.GetExpensesPerMonth(ownerId);
                var completedShipments = await _userStatistics.GetNumberOfCompletedShipments(ownerId);
                var shipmentsPerMonth = await _userStatistics.GetNumberOfShipmentsPerMonth(ownerId);

                // Build the response object
                var response = new
                {
                    Status = "success",
                    Message = "Owner statistics retrieved successfully.",
                    Data = new
                    {
                        TotalExpenses = totalExpenses,
                        TotalNumberOfShipments = totalNumberShipments,
                        TotalDistance = totalDistance,
                        ShipmentStatus = shipmentStatus,
                        SentimentStatus = sentimentStatus,
                        ExpensesPerMonth = expensesPerMonth,
                        CompletedShipments = completedShipments,
                        ShipmentsPerMonth = shipmentsPerMonth
                    }
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Status = "fail",
                    Message = "An error occurred while retrieving owner statistics.",
                    Error = ex.Message
                });
            }
        }

        [HttpGet("transporter-statistics/{transporterId:int}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]  // Bad Request
        [ProducesResponseType(422)]  // Unprocessable Entity
        [ProducesResponseType(500)]  // Internal Server Error
        [Authorize(Roles = "Transporter")]
        public async Task<IActionResult> GetTransporterStatistics(int transporterId)
        {
            try
            {
                // Retrieve all statistics
                var totalRevenues = await _userStatistics.GetTotalRevenues(transporterId);
                var totalNumberRequests = await _userStatistics.GetTotalNumberOfRequests(transporterId);
                var totalDistance = await _userStatistics.GetTotalDistance(transporterId);
                var shipmentStatus = await _userStatistics.GetShipmentStatus(transporterId);
                var sentimentStatus = await _userStatistics.GetSentimentNumbers(transporterId);
                var revenuesPerMonth = await _userStatistics.GetRevenuesPerMonth(transporterId);
                var completedShipments = await _userStatistics.GetNumberOfCompletedShipments(transporterId);
                var shipmentsPerMonth = await _userStatistics.GetNumberOfShipmentsPerMonth(transporterId);

                // Build the response object
                var response = new
                {
                    Status = "success",
                    Message = "Transporter statistics retrieved successfully.",
                    Data = new
                    {
                        TotalRevenues = totalRevenues,
                        TotalNumberOfRequests = totalNumberRequests,
                        TotalDistance = totalDistance,
                        ShipmentStatus = shipmentStatus,
                        SentimentStatus = sentimentStatus,
                        RevenuesPerMonth = revenuesPerMonth,
                        CompletedShipments = completedShipments,
                        ShipmentsPerMonth = shipmentsPerMonth
                    }
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Status = "fail",
                    Message = "An error occurred while retrieving owner statistics.",
                    Error = ex.Message
                });
            }
        }

    }
}