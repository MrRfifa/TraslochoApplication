using System.Security.Claims;
using Backend.DTOs;
using Backend.DTOs.Address;
using Backend.DTOs.User;
using Backend.DTOs.UserRequests;
using Backend.Helpers;
using Backend.Interfaces;
using Backend.Models.Classes.UsersEntities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly ITokenRepository _tokenRepository;

        public UserController(IUserRepository userRepository, ITokenRepository tokenRepository)
        {
            _userRepository = userRepository;
            _tokenRepository = tokenRepository;
        }

        [HttpPut("{userId:int}/account/email")]
        [ProducesResponseType(400)]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> ChangeEmail(int userId, [FromBody] ChangeEmailRequest changeEmailRequest)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest("ModelState");
                }

                var changeEmailResult = await _userRepository.ChangeEmail(userId, changeEmailRequest.NewEmail, changeEmailRequest.CurrentPassword);
                var user = await _userRepository.GetUserById(userId);

                if (user.UserTokens.EmailChangeToken != null)
                {
                    string recipientName = user.LastName + " " + user.FirstName;
                    string emailTemplate = new EmailTemplate().GetEmailChangeConfirmationTemplate(recipientName, user.UserTokens.EmailChangeToken);

                    var sendEmailRequest = new SendEmailRequest
                    {
                        To = changeEmailRequest.NewEmail,
                        Subject = "Email verification request",
                        Body = emailTemplate
                    };

                    if (changeEmailResult)
                    {
                        _tokenRepository.SendEmail(sendEmailRequest);

                        return Ok(new { status = "success", message = "A verification mail is sent to the new address, the token will expire in 15 minutes" });
                    }
                }
                else
                {
                    return BadRequest("Error when handling token");
                }

                return BadRequest(changeEmailResult);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [AllowAnonymous]
        [HttpGet("verify-email")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> VerifyEmailChange(string token)
        {
            var user = await _userRepository.GetUserByEmailChangeToken(token);
            if (user.UserTokens.EmailChangeToken == token)
            {
                return BadRequest(new { status = "fail", message = "You have updated your email" });
            }
            if (user == null)
            {
                return BadRequest(new { status = "fail", message = "User not found" });
            }
            if (user.UserTokens.EmailChangeTokenExpires < DateTime.Now)
            {
                return BadRequest(new { status = "fail", message = "Invalid token." });
            }

            user.Email = user.UserTokens.NewEmail;
            user.UserTokens.NewEmail = string.Empty;
            // user.UserTokens.EmailChangeToken = string.Empty;
            user.UserTokens.EmailChangeTokenExpires = DateTime.MinValue;
            await _userRepository.Save();

            return Ok(new { status = "success", message = "Email change successfully verified." });
        }

        [HttpPut("{userId:int}/account/password")]
        [ProducesResponseType(400)]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> ChangePassword(int userId, [FromBody] ChangePasswordRequest changePasswordRequest)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var changePasswordResult = await _userRepository.ChangePassword(userId, changePasswordRequest.CurrentPassword, changePasswordRequest.Password, changePasswordRequest.ConfirmPassword);

                if (changePasswordResult)
                {
                    return Ok(new { status = "success", message = "Password changed successfully." });
                }
                else
                {
                    return BadRequest(changePasswordResult);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("{userId:int}/account/names")]
        [ProducesResponseType(400)]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> ChangeNames(int userId, [FromBody] ChangeNamesRequest changeNamesRequest)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var changeNamesResult = await _userRepository.ChangeNames(userId, changeNamesRequest.NewFirstname, changeNamesRequest.NewLastname, changeNamesRequest.CurrentPassword);

                if (changeNamesResult)
                {
                    return Ok(new { status = "success", message = "Names changed successfully." });
                }
                else
                {
                    return BadRequest(changeNamesResult);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }


        [HttpPut("{userId:int}/account/address")]
        [ProducesResponseType(400)]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> ChangeAddress(int userId, [FromBody] UpdateAddressDto updateAddressDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var changeNamesResult = await _userRepository.ChangeAddress(
                                                userId, updateAddressDto.Street,
                                                updateAddressDto.City, updateAddressDto.State,
                                                updateAddressDto.PostalCode, updateAddressDto.Country,
                                                updateAddressDto.Password);

                if (changeNamesResult)
                {
                    return Ok(new { status = "success", message = "Address changed successfully." });
                }
                else
                {
                    return BadRequest(changeNamesResult);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("{userId:int}/account/dob")]
        [ProducesResponseType(400)]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [AllowAnonymous]
        public async Task<IActionResult> ChangeDateOfBirth(int userId, [FromBody] ChangeDobRequest changeDobRequest)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var changeNamesResult = await _userRepository.ChangeDob(userId, changeDobRequest.newDob, changeDobRequest.CurrentPassword);

                if (changeNamesResult)
                {
                    return Ok(new { status = "success", message = "Date of birth changed successfully." });
                }
                else
                {
                    return BadRequest(changeNamesResult);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("{userId:int}/account/profile-image")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> UploadProfileImage(int userId, IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest("Invalid file.");
                }
                var user = await _userRepository.GetUserById(userId);

                if (user == null)
                {
                    throw new Exception("User not found");
                }
                var profileImageUploaded = await _userRepository.UpdateProfileImage(userId, file);
                if (!profileImageUploaded)
                {
                    throw new Exception("Image not saved successfully");
                }

                return Ok(new { status = "success", message = "Profile image uploaded successfully." });

            }
            catch (Exception ex)
            {
                // Handle the exception, log it, or return an error response.
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing the request: " + ex.Message);
            }
        }

        [HttpGet("user-address/{userId:int}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetUserAddress(int userId)
        {
            try
            {
                var address = await _userRepository.GetUserAddress(userId);

                if (address is null)
                {
                    return NotFound("User not found");
                }

                return Ok(new { status = "success", message = address });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("user-info")]
        [ProducesResponseType(400)]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        public IActionResult GetUserInfo()
        {
            var user = HttpContext.User;

            if (user.Identity?.IsAuthenticated == true)
            {
                var claims = user.Claims.Select(c => new { Type = c.Type, Value = c.Value }).ToList();
                return Ok(claims);
            }

            return Ok("null");
        }


        [HttpGet("spec-info")]
        [ProducesResponseType(400)]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetUserSpecificInfo()
        {
            try
            {
                var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);

                if (userIdClaim == null)
                {
                    return Unauthorized("User not authenticated");
                }

                int userId = int.Parse(userIdClaim.Value);

                var user = await _userRepository.GetUserById(userId);

                if (user is null)
                {
                    return NotFound("User not found");
                }

                var userToReturn = new GetUserDto
                {
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    FileName = user.FileName,
                    FileContentBase64 = user.FileContentBase64,
                    DateOfBirth = user.DateOfBirth
                };

                return Ok(new { status = "success", message = userToReturn });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet("user-{userId:int}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetUserById(int userId)
        {
            try
            {
                var user = await _userRepository.GetUserById(userId);

                if (user is null)
                {
                    return NotFound("User not found");
                }

                var userToReturn = new GetUserDto
                {
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    FileContentBase64 = user.FileContentBase64
                };

                return Ok(new { status = "success", message = userToReturn });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("owners")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<ICollection<Owner>>> GetOwners()
        {
            var owners = await _userRepository.GetOwners();
            return Ok(owners); // Return 200 OK with the owners data
        }

        [HttpGet("transporters")]
        [ProducesResponseType(200)]
        public async Task<ActionResult<ICollection<Transporter>>> GetTransporters()
        {
            var transporters = await _userRepository.GetTransporters();
            return Ok(transporters); // Return 200 OK with the transporters data
        }

        [HttpGet("transporter-{transporterId:int}")]
        [ProducesResponseType(400)]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetTransporterInfoById(int transporterId)
        {
            try
            {
                var transporter = await _userRepository.GetTransporterInfoById(transporterId);

                if (transporter is null)
                {
                    return NotFound(new { status = "fail", message = "User not found" });
                }

                return Ok(new { status = "success", message = transporter });
            }
            catch (Exception ex)
            {
                return BadRequest(new { status = "fail", message = ex.Message });
            }
        }


    }
}