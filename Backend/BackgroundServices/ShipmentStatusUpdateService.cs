using Backend.Interfaces;
using Microsoft.Extensions.DependencyInjection;

namespace Backend.BackgroundServices
{
    public class ShipmentStatusUpdateService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider; // Use IServiceProvider
        private readonly ILogger<ShipmentStatusUpdateService> _logger;

        // Inject IServiceProvider to create scope for resolving scoped services
        public ShipmentStatusUpdateService(IServiceProvider serviceProvider, ILogger<ShipmentStatusUpdateService> logger)
        {
            _serviceProvider = serviceProvider; // Store IServiceProvider to create scope
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation("Background task started.");
                try
                {
                    // Create a new scope for resolving scoped services
                    using (var scope = _serviceProvider.CreateScope())
                    {
                        var shipmentRepository = scope.ServiceProvider.GetRequiredService<IShipmentRepository>();

                        // Get pending shipments to update status
                        var pendingShipmentsToUpdate = await shipmentRepository.GetPendingPassedShipments();
                        foreach (var shipment in pendingShipmentsToUpdate!)
                        {
                            await shipmentRepository.UpdateShipmentStatus(shipment.Id, 1); // Set to completed
                        }

                        // Get accepted shipments to update status
                        var acceptedShipmentsToUpdate = await shipmentRepository.GetAcceptedPassedShipments();
                        foreach (var shipment in acceptedShipmentsToUpdate!)
                        {
                            await shipmentRepository.UpdateShipmentStatus(shipment.Id, 0); // Set to canceled
                        }
                    }
                    // Wait for the next check after a delay 12 hours.
                    await Task.Delay(TimeSpan.FromHours(12), stoppingToken);
                }
                catch (OperationCanceledException)
                {
                    _logger.LogInformation("Background service is stopping.");
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred while updating shipment statuses.");
                }
            }
        }
    }
}
