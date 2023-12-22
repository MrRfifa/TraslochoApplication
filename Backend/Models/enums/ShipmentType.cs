using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace Backend.Models.enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum ShipmentType
    {
        [EnumMember(Value = "Transporting")]
        Transporting,
        [EnumMember(Value = "Throwing")]
        Throwing
    }
}