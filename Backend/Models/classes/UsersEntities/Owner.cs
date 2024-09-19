using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Models.Classes.UsersEntities
{
    public class Owner : User
    {
        public ICollection<Shipment>? Shipments { get; set; }
        public ICollection<Review>? OwnerReviews { get; set; }
        // public ICollection<OwnerShipment>? OwnerShipments { get; set; }
    }
}