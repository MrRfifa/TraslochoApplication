using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Models.classes
{
    public class VehicleImage : ImageFile
    {
        public int VehicleId { get; set; }
    }
}