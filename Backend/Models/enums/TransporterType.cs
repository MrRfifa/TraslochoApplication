using System.Runtime.Serialization;

namespace Backend.Models.Enums
{
    public enum TransporterType
    {
        [EnumMember(Value = "Private")]
        Private=0,

        [EnumMember(Value = "Society")]
        Society=1
    }
}