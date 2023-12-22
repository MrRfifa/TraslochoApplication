using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace Backend.Models.enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum ShipmentStatus
    {
        [EnumMember(Value = "Pending")]
        Pending,
        [EnumMember(Value = "Accepted")]
        Accepted,
        [EnumMember(Value = "Completed")]
        Completed,
        [EnumMember(Value = "Canceled")]
        Canceled
    }
}