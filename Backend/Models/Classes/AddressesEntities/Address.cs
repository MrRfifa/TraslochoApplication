using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using Backend.Models.Enums;

namespace Backend.Models.Classes.AddressesEntities
{
    [KnownType(typeof(ShipmentAddress))]
    [KnownType(typeof(UserAddress))]
    public class Address
    {
        public int Id { get; set; }
        public string Street { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string PostalCode { get; set; } = string.Empty;

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public EuCountries Country { get; set; }
    }
}