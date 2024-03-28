using System.Runtime.Serialization;

namespace Backend.Models.enums
{
    public enum RequestStatus
    {
        [EnumMember(Value = "Pending")]
        Pending,
        [EnumMember(Value = "Accepted")]
        Accepted,
        [EnumMember(Value = "Refused")]
        Refused,
    }
}