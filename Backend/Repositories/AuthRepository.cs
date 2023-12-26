using AutoMapper;
using Backend.Data;
using Backend.Dtos;
using Backend.Dtos.AddressDto;
using Backend.Dtos.RegisterUsers;
using Backend.Interfaces;
using Backend.Models.classes;
using Backend.Models.enums;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DataContext _context;
        private readonly IUserRepository _userRepository;
        private readonly ITokenRepository _tokenRepository;

        private readonly IMapper _mapper;

        public AuthRepository(DataContext context, IUserRepository userRepository, ITokenRepository tokenRepository, IMapper mapper)
        {
            _mapper = mapper;
            _tokenRepository = tokenRepository;
            _userRepository = userRepository;
            _context = context;
        }
        public async Task<bool> ForgetPassword(string email)
        {
            var user = await _userRepository.GetUserByEmail(email);
            user.UserTokens.PasswordResetToken = await _tokenRepository.GenerateUniqueToken();
            user.UserTokens.ResetTokenExpires = DateTime.Now.AddHours(1);
            return await Save();
        }

        public async Task<string> Login(LoginUserDto userLogged)
        {
            var user = await _userRepository.GetUserByEmail(userLogged.Email);

            // Check if the user is verified
            if (user.UserTokens.VerifiedAt == DateTime.MinValue)
            {
                throw new Exception("User is not verified.");
            }

            // Verify the password
            if (!_tokenRepository.VerifyPasswordHash(userLogged.Password, user.PasswordHash, user.PasswordSalt))
            {
                throw new Exception("Incorrect password.");
            }

            // Create and return the token
            return _tokenRepository.CreateToken(user);
        }

        public async Task<bool> RegisterTransporter(RegisterTransporterDto userCreated)
        {
            try
            {
                _tokenRepository.CreatePasswordHash(userCreated.Password, out byte[] passwordHash, out byte[] passwordSalt);

                var file = userCreated.ProfileImage;
                if (file is null)
                {
                    throw new Exception("Profile image file is required");
                }
                using (var ms = new MemoryStream())
                {
                    await file.CopyToAsync(ms);

                    // Convert the image to a base64-encoded string.
                    byte[] bytes = ms.ToArray();
                    string base64Image = Convert.ToBase64String(bytes);
                    // Use userEntity instead of user for setting properties
                    var userEntity = new Transporter
                    {
                        LastName = userCreated.LastName,
                        FirstName = userCreated.FirstName,
                        Email = userCreated.Email,
                        Role = UserRole.Transporter,
                        TransporterType = userCreated.TransporterType,
                        DateOfBirth = userCreated.DateOfBirth,
                        PasswordHash = passwordHash,
                        PasswordSalt = passwordSalt,
                        InternationalPrefix = userCreated.InternationalPrefix,
                        PhoneNumber = userCreated.PhoneNumber,
                        UserTokens = new UserTokens
                        {
                            VerificationToken = await _tokenRepository.GenerateUniqueToken()
                        },
                        UserAddress = _mapper.Map<UserAddress>(userCreated.UserAddress),
                        FileName = file.FileName,  // Assuming FileName is a property of User
                        FileContentBase64 = bytes  // Assuming FileContentBase64 is a property of User
                    };

                    _context.Users.Add(userEntity);

                    return await Save();
                }
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> RegisterOwner(RegisterOwnerDto userCreated)
        {
            try
            {
                _tokenRepository.CreatePasswordHash(userCreated.Password, out byte[] passwordHash, out byte[] passwordSalt);

                var file = userCreated.ProfileImage;
                if (file is null)
                {
                    throw new Exception("Profile image file is required");
                }
                using (var ms = new MemoryStream())
                {
                    await file.CopyToAsync(ms);

                    // Convert the image to a base64-encoded string.
                    byte[] bytes = ms.ToArray();
                    string base64Image = Convert.ToBase64String(bytes);

                    // Use userEntity instead of user for setting properties
                    var userEntity = new Owner
                    {
                        LastName = userCreated.LastName,
                        FirstName = userCreated.FirstName,
                        Email = userCreated.Email,
                        Role = UserRole.Owner,
                        DateOfBirth = userCreated.DateOfBirth,
                        PasswordHash = passwordHash,
                        PasswordSalt = passwordSalt,
                        InternationalPrefix = userCreated.InternationalPrefix,
                        PhoneNumber = userCreated.PhoneNumber,
                        UserTokens = new UserTokens
                        {
                            VerificationToken = await _tokenRepository.GenerateUniqueToken()
                        },
                        UserAddress = _mapper.Map<UserAddress>(userCreated.UserAddress),
                        FileName = file.FileName,  // Assuming FileName is a property of User
                        FileContentBase64 = bytes  // Assuming FileContentBase64 is a property of User
                    };

                    _context.Users.Add(userEntity);

                    return await Save();
                }
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> Save()
        {
            var saved = await _context.SaveChangesAsync();
            return saved > 0;
        }

        public async Task<bool> DeleteAccount(int userId, string currentPassword)
        {
            var userExists = await _userRepository.UserExistsById(userId);
            if (!userExists)
            {
                throw new Exception($"User with ID {userId} not found");
            }
            var user = await _userRepository.GetUserById(userId);

            // Verify the user's password
            if (!_tokenRepository.VerifyPasswordHash(currentPassword, user.PasswordHash, user.PasswordSalt))
            {
                throw new Exception("Incorrect password. Account deletion denied.");
            }
            user.UserTokens.DeleteAccountToken = await _tokenRepository.GenerateUniqueToken();
            user.UserTokens.DeleteAccountTokenExpires = DateTime.Now.AddMinutes(15);
            return await Save();
        }

        public async Task<bool> DeleteAccountVerification(string token)
        {
            var user = await _userRepository.GetUserByDeleteAccountToken(token);

            if (user == null)
            {
                throw new Exception($"User not found");
            }

            if (user.UserTokens.DeleteAccountTokenExpires < DateTime.Now)
            {
                throw new Exception("Token has expired");
            }

            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    //TODO: Add the deletion account logic
                    await DeletionOfAllAssets(user.Id);
                    _context.Remove(user);
                    transaction.Commit();
                    return await Save();
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new Exception(ex.Message);
                }
            }
        }

        public async Task<bool> DeletionOfAllAssets(int userId)
        {
            // var imagesToDelete = await _context.Images
            //                                     .Include(ld => ld.ImageFile)
            //                                     .Where(ld => ld.UserId == userId)
            //                                     .ToListAsync();
            // foreach (var image in imagesToDelete)
            // {
            //     _context.Remove(image.ImageFile);
            // }
            // _context.RemoveRange(imagesToDelete);

            return await Save();
        }

        public async Task<bool> VerifyAccount(string token)
        {

            var user = await _userRepository.GetUserByVerificationToken(token);

            if (user is null)
            {
                throw new Exception("hhhh");
            }

            user.UserTokens.VerifiedAt = DateTime.Now;
            return await Save();

        }
    }
}