using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Models.classes
{
    public class ShipmentAddress : Address
    {
        public int ShipmentId { get; set; }
    }
}