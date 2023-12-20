using System.Text.Json.Serialization;

namespace Backend.Models.enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum ShipmentStatus
    {
        Pending,
        Accepted,
        Completed,
        Canceled
    }
}