using System.Runtime.Serialization;

namespace Backend.Models.Enums
{
    public enum VehicleType
    {
        [EnumMember(Value = "Van")]
        Van = 0,

        [EnumMember(Value = "Truck")]
        Truck = 1
    }
}