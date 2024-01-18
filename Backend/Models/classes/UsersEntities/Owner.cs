
using System.ComponentModel.DataAnnotations;

namespace Backend.Models.classes.UsersEntities
{
    public class Owner : User
    {
        public ICollection<OwnerShipment>? OwnerShipments { get; set; }
        public ICollection<Shipment>? Shipments { get; set; }
    }
}