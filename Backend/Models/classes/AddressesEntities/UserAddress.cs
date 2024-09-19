using Backend.Models.Classes.UsersEntities;

namespace Backend.Models.Classes.AddressesEntities
{
    public class UserAddress : Address
    {
        public int UserId { get; set; }
        public User? User { get; set; }
    }
}