using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace Backend.Models.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum ShipmentType
    {
        [EnumMember(Value = "Transporting")]
        Transporting = 0,
        [EnumMember(Value = "Throwing")]
        Throwing = 1
    }
}