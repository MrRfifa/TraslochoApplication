using System.ComponentModel.DataAnnotations;
using Backend.Models.enums;

namespace Backend.Models.classes.UsersEntities
{
    public class Company
    {

        public int Id { get; set; }

        [Required(ErrorMessage = "Company name is required.")]
        public string CompanyName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        public string Email { get; set; } = string.Empty;
        public byte[] PasswordHash { get; set; } = Array.Empty<byte>();
        public byte[] PasswordSalt { get; set; } = Array.Empty<byte>();

        [Required(ErrorMessage = "Prefix is required.")]
        public EuropeanPhonePrefix InternationalPrefix { get; set; }

        [Required(ErrorMessage = "Phone Number is required.")]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "The address is required.")]
        public UserAddress UserAddress { get; set; } = new UserAddress();

        [Required(ErrorMessage = "File Name is required.")]
        public string FileName { get; set; } = string.Empty;

        [Required(ErrorMessage = "File Content is required.")]
        public byte[] FileContentBase64 { get; set; } = Array.Empty<byte>();
        public UserTokens UserTokens { get; set; } = new UserTokens();
        public UserRole Role { get; set; }



        public TransporterType TransporterType { get; set; }
        public ICollection<Shipment>? Shipments { get; set; }
        public ICollection<TransporterShipment>? TransporterShipments { get; set; }
        public ICollection<Vehicle>? Vehicles { get; set; }
    }
}