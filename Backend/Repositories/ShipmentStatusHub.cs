using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Interfaces;
using Backend.Models.enums;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class ShipmentStatusHub : Hub<IShipmentStatusHub>
    {
        private readonly DataContext _context;
        public ShipmentStatusHub(DataContext context)
        {
            _context = context;
        }

        public override Task OnConnectedAsync()
        {
            return Clients.All.SendMessage($"{Context.ConnectionId} has joined");
        }

        // public async Task UpdateShipmentStatusPending(int shipmentId, int transporterId, int ownerId)
        // {
        //     await Clients.All.UpdateShipmentStatusPending(shipmentId, transporterId, ownerId);
        // }

        public async Task UpdateShipmentStatusAccepted(int shipmentId, string message)
        {
            var shipmentToUpdate = await _context.Shipments.FindAsync(shipmentId);
            var transporterShipmentToUpdate = await _context.TransporterShipments.FindAsync(shipmentId);
            var ownerShipmentToUpdate = await _context.OwnerShipments.FindAsync(shipmentId);

            if (shipmentToUpdate != null && transporterShipmentToUpdate != null && ownerShipmentToUpdate != null)
            {
                shipmentToUpdate.ShipmentStatus = ShipmentStatus.Accepted;
                transporterShipmentToUpdate.ShipmentStatus = ShipmentStatus.Accepted;
                ownerShipmentToUpdate.ShipmentStatus = ShipmentStatus.Accepted;

                await _context.SaveChangesAsync();

                await Clients.All.SendMessage(message);
            }
        }


        public async Task UpdateShipmentStatusCompleted(int shipmentId, string message)
        {
            var shipmentToUpdate = await _context.Shipments.FindAsync(shipmentId);
            var transporterShipmentToUpdate = await _context.TransporterShipments.FindAsync(shipmentId);
            var ownerShipmentToUpdate = await _context.OwnerShipments.FindAsync(shipmentId);

            if (shipmentToUpdate != null && transporterShipmentToUpdate != null && ownerShipmentToUpdate != null)
            {
                shipmentToUpdate.ShipmentStatus = ShipmentStatus.Completed;
                transporterShipmentToUpdate.ShipmentStatus = ShipmentStatus.Completed;
                ownerShipmentToUpdate.ShipmentStatus = ShipmentStatus.Completed;

                await _context.SaveChangesAsync();

                await Clients.All.SendMessage(message);
            }
        }

        public async Task UpdateShipmentStatusCanceled(int shipmentId, string message)
        {
            var shipmentToUpdate = await _context.Shipments.FindAsync(shipmentId);
            var transporterShipmentToUpdate = await _context.TransporterShipments.FindAsync(shipmentId);
            var ownerShipmentToUpdate = await _context.OwnerShipments.FindAsync(shipmentId);

            if (shipmentToUpdate != null && transporterShipmentToUpdate != null && ownerShipmentToUpdate != null)
            {
                shipmentToUpdate.ShipmentStatus = ShipmentStatus.Canceled;
                transporterShipmentToUpdate.ShipmentStatus = ShipmentStatus.Canceled;
                ownerShipmentToUpdate.ShipmentStatus = ShipmentStatus.Canceled;

                await _context.SaveChangesAsync();

                await Clients.All.SendMessage(message);
            }
        }
    }
}