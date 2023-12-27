using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Interfaces
{
    public interface IShipmentStatusHub
    {
        // Task UpdateShipmentStatusPending(int shipmentId, int transporterId, int ownerId);
        // Task<string> UpdateShipmentStatusAccepted(int shipmentId, int transporterId, int ownerId);
        // Task<string> UpdateShipmentStatusCompleted(int shipmentId, int transporterId, int ownerId);
        // Task<string> UpdateShipmentStatusCanceled(int shipmentId, int transporterId, int ownerId);
        Task<string> SendMessage( string message);
    }
}