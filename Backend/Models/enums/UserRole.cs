using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace Backend.Models.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum UserRole
    {
        [EnumMember(Value = "Owner")]
        Owner = 0,
        [EnumMember(Value = "Transporter")]
        Transporter = 1
    }
}