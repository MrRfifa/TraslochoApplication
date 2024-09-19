using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.DTOs;
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
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IAuthRepository _authRepository;
        private readonly ITokenRepository _tokenRepository;

        public AuthController(IUserRepository userRepository, IAuthRepository authRepository, ITokenRepository tokenRepository)
        {
            _tokenRepository = tokenRepository;
            _userRepository = userRepository;
            _authRepository = authRepository;
        }

        [HttpPost("register-transporter")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]  // Bad Request
        [ProducesResponseType(422)]  // Unprocessable Entity
        [ProducesResponseType(500)]  // Internal Server Error
        public async Task<IActionResult> RegisterTrasporter([FromForm] RegisterUserDto transporterToCreate)
        {
            if (transporterToCreate == null || !ModelState.IsValid)
            {
                return BadRequest(new { status = "error", message = "Invalid data provided", errors = ModelState.Values.SelectMany(v => v.Errors) });
            }

            try
            {
                bool emailExists = await _userRepository.UserExistsByEmail(transporterToCreate.Email);
                if (emailExists)
                {
                    return StatusCode(422, new { status = "error", message = "This email is already in use." });
                }

                bool phoneNumberExists = await _userRepository.UserExistsByPhoneNumber(transporterToCreate.PhoneNumber);
                if (phoneNumberExists)
                {
                    return StatusCode(422, new { status = "error", message = "This phone number is already in use." });
                }

                bool isRegistered = await _authRepository.RegisterTransporter(transporterToCreate);
                User registeredUser = await _userRepository.GetUserByEmail(transporterToCreate.Email);
                if (isRegistered)
                {
                    // Send email verification
                    string recipientName = $"{transporterToCreate.LastName} {transporterToCreate.FirstName}";
                    var sendEmailRequest = new SendEmailRequest
                    {
                        To = transporterToCreate.Email,
                        Subject = "Email verification request",
                        Body = new EmailTemplate().GetEmailConfirmationTemplate(recipientName, registeredUser.UserTokens.VerificationToken)
                    };

                    _tokenRepository.SendEmail(sendEmailRequest);
                    return Ok(new { status = "success", message = "Successfully registered. Please verify your email." });
                }
                else
                {
                    return StatusCode(500, new { status = "error", message = "Something went wrong while saving the user." });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = "error", message = "Internal server error: " + ex.Message });
            }
        }


        [HttpPost("register-owner")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]  // Bad Request
        [ProducesResponseType(422)]  // Unprocessable Entity
        [ProducesResponseType(500)]  // Internal Server Error
        public async Task<IActionResult> RegisterOwner([FromForm] RegisterUserDto ownerToCreate)
        {
            if (ownerToCreate == null || !ModelState.IsValid)
            {
                return BadRequest(new { status = "error", message = "Invalid data provided", errors = ModelState.Values.SelectMany(v => v.Errors) });
            }

            try
            {
                bool emailExists = await _userRepository.UserExistsByEmail(ownerToCreate.Email);
                if (emailExists)
                {
                    return StatusCode(422, new { status = "error", message = "This email is already in use." });
                }

                bool phoneNumberExists = await _userRepository.UserExistsByPhoneNumber(ownerToCreate.PhoneNumber);
                if (phoneNumberExists)
                {
                    return StatusCode(422, new { status = "error", message = "This phone number is already in use." });
                }

                bool isRegistered = await _authRepository.RegisterOwner(ownerToCreate);
                User registeredUser = await _userRepository.GetUserByEmail(ownerToCreate.Email);
                if (isRegistered)
                {
                    // Send email verification
                    string recipientName = $"{ownerToCreate.LastName} {ownerToCreate.FirstName}";
                    var sendEmailRequest = new SendEmailRequest
                    {
                        To = ownerToCreate.Email,
                        Subject = "Email verification request",
                        Body = new EmailTemplate().GetEmailConfirmationTemplate(recipientName, registeredUser.UserTokens.VerificationToken)
                    };

                    _tokenRepository.SendEmail(sendEmailRequest);
                    return Ok(new { status = "success", message = "Successfully registered. Please verify your email." });
                }
                else
                {
                    return StatusCode(500, new { status = "error", message = "Something went wrong while saving the user." });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = "error", message = "Internal server error: " + ex.Message });
            }
        }



        [HttpPost("login")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> Login([FromBody] LoginUserDto userLogged)
        {
            try
            {
                if (userLogged == null)
                {
                    return BadRequest("Invalid request. Please provide valid login credentials.");
                }

                var token = await _authRepository.Login(userLogged);

                if (string.IsNullOrEmpty(token))
                {
                    return BadRequest("Authentication failed. Please check your credentials.");
                }

                return Ok(new { message = "success", Token = token });
            }
            catch (Exception ex)
            {
                // Log the exception for internal investigation, but provide a generic error message to the client
                return StatusCode(400, ex.Message);
            }
        }

        [HttpGet("verify")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> Verify(string token)
        {
            try
            {
                var userToVerify = await _authRepository.VerifyAccount(token);

                if (!userToVerify)
                {
                    return Ok(new { status = "failed", message = "User already verified" });
                }

                return Ok(new { status = "success", message = "User verified! :)" });
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }

        [HttpPost("forgot-password")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> ForgotPassword([FromBody] string email)
        {
            var user = await _userRepository.GetUserByEmail(email);

            if (user == null)
            {
                return BadRequest("User not found.");
            }

            if (await _authRepository.ForgetPassword(email))
            {
                if (user.UserTokens.PasswordResetToken is not null)
                {
                    string recipientName = $"{user.LastName} {user.FirstName}";
                    string emailTemplate = new EmailTemplate().GetEmailResetPasswordTemplate(recipientName, user.UserTokens.PasswordResetToken);

                    var sendEmailRequest = new SendEmailRequest
                    {
                        To = user.Email,
                        Subject = "Reset Password request",
                        Body = emailTemplate
                    };

                    _tokenRepository.SendEmail(sendEmailRequest);

                    return Ok(new { status = "success", message = "A confirmation mail was sent to the provided mail" });
                }
                else
                {
                    return BadRequest("Something went wrong");
                }
            }

            return BadRequest("Something went wrong");
        }

        [HttpPost("reset-password")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [AllowAnonymous]
        public async Task<IActionResult> ResetPassword(ResetPasswordRequest resetPasswordRequest)
        {
            try
            {
                var user = await _userRepository.GetUserByResetToken(resetPasswordRequest.Token);

                if (user == null)
                {
                    return BadRequest("User not found.");
                }

                if (user.UserTokens.ResetTokenExpires < DateTime.Now)
                {
                    return BadRequest("Invalid Token.");
                }

                _tokenRepository.CreatePasswordHash(resetPasswordRequest.Password, out byte[] passwordHash, out byte[] passwordSalt);

                user.PasswordHash = passwordHash;
                user.PasswordSalt = passwordSalt;
                user.UserTokens.PasswordResetToken = "";
                user.UserTokens.ResetTokenExpires = DateTime.MinValue;

                await _authRepository.Save();

                return Ok(new { status = "success", message = "Password successfully reset." });
            }
            catch (Exception ex)
            {
                return StatusCode(400, ex.Message);
            }
        }

        [HttpPost("logout/{userId:int}")]
        public async Task<IActionResult> Logout(int userId)
        {
            try
            {
                // Assuming request.UserEmail contains the email of the user to log out
                bool logoutResult = await _authRepository.Logout(userId);

                if (logoutResult)
                {
                    return Ok(new { status = "success", message = "Logout successful." });
                }
                else
                {
                    return BadRequest(new { status = "faied", message = "Logout failed." });
                }
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Internal server error." });
            }
        }

    }
}