using System.ComponentModel.DataAnnotations;

namespace Backend.Models.classes
{
    public class VehicleImage
    {
        public int Id { get; set; }

        [DataType(DataType.Date)]
        public DateTime UploadDate { get; set; }

        [Required(ErrorMessage = "File Name is required.")]
        public string FileName { get; set; } = string.Empty;

        [Required(ErrorMessage = "File Content is required.")]
        public byte[] FileContentBase64 { get; set; } = Array.Empty<byte>();
    }
}