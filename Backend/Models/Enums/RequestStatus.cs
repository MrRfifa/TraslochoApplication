using System.Runtime.Serialization;

namespace Backend.Models.Enums
{
    public enum RequestStatus
    {
        [EnumMember(Value = "Pending")]
        Pending = 0,
        [EnumMember(Value = "Accepted")]
        Accepted = 1,
        [EnumMember(Value = "Refused")]
        Refused = 2,
    }
}