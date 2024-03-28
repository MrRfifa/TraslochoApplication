using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Models.enums;

namespace Backend.Dtos.RequestDto
{
    public record GetRequestDto
    {
        public int Id { get; set; }
        public int TransporterId { get; set; }
        public int ShipmentId { get; set; }
        public RequestStatus Status { get; set; }
    }
}