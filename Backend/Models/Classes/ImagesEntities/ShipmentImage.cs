using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Models.Classes.ImagesEntities
{
    public class ShipmentImage : ImageFile
    {
        public int ShipmentId { get; set; }
        // Foreign key reference to Shipment
        public Shipment? Shipment { get; set; }
    }
}