using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace Backend.Models.enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum UserRole
    {
        [EnumMember(Value = "Owner")]
        Owner,
        [EnumMember(Value = "Transporter")]
        Transporter
    }
}