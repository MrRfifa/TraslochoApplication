using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Models.classes
{
    public class ShipmentImage : ImageFile
    {
        public int ShipmentId { get; set; }
    }
}