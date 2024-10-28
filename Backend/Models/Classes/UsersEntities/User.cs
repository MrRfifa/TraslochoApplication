using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using Backend.Models.Classes.AddressesEntities;
using Backend.Models.Enums;

namespace Backend.Models.Classes.UsersEntities
{
    [KnownType(typeof(Transporter))]
    [KnownType(typeof(Owner))]
    public class User
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "First name is required.")]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Last name is required.")]
        public string LastName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        public string Email { get; set; } = string.Empty;

        public byte[] PasswordHash { get; set; } = Array.Empty<byte>();
        public byte[] PasswordSalt { get; set; } = Array.Empty<byte>();

        [Required(ErrorMessage = "Prefix is required.")]
        public EuropeanPhonePrefix InternationalPrefix { get; set; }

        [Required(ErrorMessage = "Phone Number is required.")]
        public string PhoneNumber { get; set; } = string.Empty;

        [DataType(DataType.Date)]
        public DateTime DateOfBirth { get; set; }

        [Required(ErrorMessage = "The address is required.")]
        public UserAddress UserAddress { get; set; } = new UserAddress();

        [Required(ErrorMessage = "File Name is required.")]
        public string FileName { get; set; } = string.Empty;

        [Required(ErrorMessage = "File Content is required.")]
        public byte[] FileContentBase64 { get; set; } = Array.Empty<byte>();

        public UserToken UserTokens { get; set; } = new UserToken();
        public UserRole Role { get; set; }

        // Navigation property to Notifications
        public ICollection<Notification>? Notifications { get; set; }
    }
}