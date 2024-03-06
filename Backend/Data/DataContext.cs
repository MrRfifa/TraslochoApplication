using Backend.Models.classes;
using Backend.Models.classes.UsersEntities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        { }

        // Define DbSet for each entity
        public DbSet<Address> Addresses { get; set; }
        public DbSet<Owner> Owners { get; set; }
        public DbSet<Shipment> Shipments { get; set; }
        public DbSet<Transporter> Transporters { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<UserTokens> UserTokens { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<ImageFile> Images { get; set; }
        public DbSet<TransporterShipment> TransporterShipments { get; set; }
        public DbSet<OwnerShipment> OwnerShipments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure OwnerShipment relationship
            modelBuilder.Entity<OwnerShipment>()
                .HasKey(os => os.OwnerShipmentId);

            modelBuilder.Entity<OwnerShipment>()
                .HasOne(os => os.Owner)
                .WithMany(o => o.OwnerShipments)
                .HasForeignKey(os => os.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<OwnerShipment>()
                .HasOne(os => os.Vehicle)
                .WithMany(v => v.OwnerShipments)
                .HasForeignKey(os => os.VehicleId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<OwnerShipment>()
                .HasOne(os => os.Shipment)
                .WithMany(s => s.OwnerShipments)
                .HasForeignKey(os => os.ShipmentId);

            // Configure TransporterShipment relationship
            modelBuilder.Entity<TransporterShipment>()
                .HasKey(ts => ts.TransporterShipmentId);

            modelBuilder.Entity<TransporterShipment>()
                .HasOne(ts => ts.Transporter)
                .WithMany(t => t.TransporterShipments)
                .HasForeignKey(ts => ts.TransporterId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<TransporterShipment>()
                .HasOne(ts => ts.Vehicle)
                .WithMany(v => v.TransporterShipments)
                .HasForeignKey(ts => ts.VehicleId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<TransporterShipment>()
                .HasOne(ts => ts.Shipment)
                .WithMany(s => s.TransporterShipments)
                .HasForeignKey(ts => ts.ShipmentId);

            modelBuilder.Entity<Shipment>()
                .HasOne(s => s.Transporter)
                .WithMany(t => t.Shipments)
                .HasForeignKey(s => s.TransporterId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Shipment>()
                .HasOne(s => s.Owner)
                .WithMany(o => o.Shipments)
                .HasForeignKey(s => s.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Shipment>()
                .HasOne(s => s.DestinationAddress)
                .WithOne()
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Shipment>()
                .HasMany(s => s.Images)
                .WithOne()
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Vehicle>()
                .HasOne(v => v.Transporter)
                .WithMany(t => t.Vehicles)
                .HasForeignKey(v => v.TransporterId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Vehicle>()
                .HasMany(v => v.VehicleImages)
                .WithOne()
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<User>()
                .HasOne(u => u.UserAddress)
                .WithOne()
                .HasForeignKey<UserAddress>(ua => ua.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure profile image column type
            modelBuilder.Entity<User>()
                .Property(u => u.FileContentBase64)
                .HasColumnType("varbinary(max)");

            // Configure enums conversions
            modelBuilder.Entity<Owner>()
                .Property(o => o.Role)
                .HasConversion<string>();

            modelBuilder.Entity<Transporter>()
                .Property(t => t.Role)
                .HasConversion<string>();

            modelBuilder.Entity<Transporter>()
                .Property(t => t.TransporterType)
                .HasConversion<string>();

            modelBuilder.Entity<Shipment>()
                .Property(s => s.ShipmentStatus)
                .HasConversion<string>();

            modelBuilder.Entity<Shipment>()
                .Property(s => s.ShipmentType)
                .HasConversion<string>();

            modelBuilder.Entity<Vehicle>()
                .Property(v => v.VehicleType)
                .HasConversion<string>();

            modelBuilder.Entity<User>()
                .Property(u => u.InternationalPrefix)
                .HasConversion<string>();

            base.OnModelCreating(modelBuilder);
        }
    }
}
