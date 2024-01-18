using System.Security.Claims;
using Backend.Dtos.Requests;
using Backend.Dtos.UsersDto;
using Backend.Helpers;
using Backend.Interfaces;
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

        [HttpPut("{userId}/account/email")]
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
            if (user == null)
            {
                return BadRequest("User not found");
            }
            if (user.UserTokens.EmailChangeTokenExpires < DateTime.Now)
            {
                return BadRequest("Invalid token.");
            }

            user.Email = user.UserTokens.NewEmail;
            user.UserTokens.NewEmail = string.Empty;
            user.UserTokens.EmailChangeToken = string.Empty;
            user.UserTokens.EmailChangeTokenExpires = DateTime.MinValue;
            await _userRepository.Save();

            return Ok(new { status = "success", message = "Email change successfully verified." });
        }

        [HttpPut("{userId}/account/password")]
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

        [HttpPut("{userId}/account/names")]
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
                    FileContentBase64 = user.FileContentBase64
                };

                return Ok(new { status = "success", message = userToReturn });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet("user-{userId}")]
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


    }
}