using System.Runtime.Serialization;

namespace Backend.Models.enums
{
    public enum TransporterType
    {
        [EnumMember(Value = "Private")]
        Private,

        [EnumMember(Value = "Society")]
        Society
    }
}