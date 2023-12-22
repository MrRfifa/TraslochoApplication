using System.Runtime.Serialization;

namespace Backend.Models.enums
{
    public enum VehicleType 
    {
        [EnumMember(Value = "Van")]
        Van,

        [EnumMember(Value = "Truck")]
        Truck
    }
}