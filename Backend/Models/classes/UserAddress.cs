using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Models.classes
{
    public class UserAddress : Address
    {
        public int UserId { get; set; }
    }
}