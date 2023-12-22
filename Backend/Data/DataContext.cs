using Backend.Models.classes;
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
        public DbSet<VehicleImage> VehicleImages { get; set; }
        public DbSet<TransporterShipment> TransporterShipments { get; set; }
        public DbSet<OwnerShipment> OwnerShipments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure OwnerShipment relationship
            modelBuilder.Entity<OwnerShipment>()
                .HasKey(os => new { os.OwnerShipmentId });

            modelBuilder.Entity<OwnerShipment>()
                .HasOne(o => o.Owner)
                .WithMany(u => u.OwnerShipments)
                .HasForeignKey(o => o.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<OwnerShipment>()
                .HasOne(o => o.Vehicle)
                .WithMany(i => i.OwnerShipments)
                .HasForeignKey(o => o.VehicleId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<OwnerShipment>()
                .HasOne(o => o.Shipment)
                .WithMany(i => i.OwnerShipments)
                .HasForeignKey(o => o.ShipmentId);

            // Configure TransporterShipment relationship
            modelBuilder.Entity<TransporterShipment>()
                .HasKey(os => new { os.TransporterShipmentId });

            modelBuilder.Entity<TransporterShipment>()
                .HasOne(o => o.Transporter)
                .WithMany(u => u.TransporterShipments)
                .HasForeignKey(o => o.TransporterId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<TransporterShipment>()
                .HasOne(o => o.Vehicle)
                .WithMany(i => i.TransporterShipments)
                .HasForeignKey(o => o.VehicleId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<TransporterShipment>()
                .HasOne(o => o.Shipment)
                .WithMany(i => i.TransporterShipments)
                .HasForeignKey(o => o.ShipmentId);



            modelBuilder.Entity<Shipment>()
                .HasOne(s => s.Transporter)
                .WithMany(t => t.Shipments)
                .HasForeignKey(s => s.TransporterId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Shipment>()
                .HasOne(s => s.Owner)
                .WithMany(t => t.Shipments)
                .HasForeignKey(s => s.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Shipment>()
                .HasOne(s => s.Address)
                .WithOne()
                .HasForeignKey<Shipment>(s => s.AddressId)
                .OnDelete(DeleteBehavior.Restrict);



            modelBuilder.Entity<Vehicle>()
                .HasOne(v => v.Transporter)       // A Vehicle has one Transporter
                .WithMany(t => t.Vehicles)         // A Transporter can have many Vehicles
                .HasForeignKey(v => v.TransporterId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Vehicle>()
                .HasMany(v => v.VehicleImages)
                .WithOne()
                .OnDelete(DeleteBehavior.Restrict);



            // Configure profile image column type
            modelBuilder.Entity<User>()
                .Property(u => u.FileContentBase64)
                .HasColumnType("varbinary(max)");

            // Configure enums conversions
            modelBuilder.Entity<Owner>()
                .Property(u => u.Role)
                .HasConversion<string>();

            modelBuilder.Entity<Transporter>()
                .Property(u => u.Role)
                .HasConversion<string>();

            modelBuilder.Entity<Transporter>()
                .Property(u => u.TransporterType)
                .HasConversion<string>();

            modelBuilder.Entity<Shipment>()
                .Property(u => u.ShipmentStatus)
                .HasConversion<string>();

            modelBuilder.Entity<Shipment>()
                .Property(u => u.ShipmentType)
                .HasConversion<string>();

            modelBuilder.Entity<Vehicle>()
                .Property(u => u.VehicleType)
                .HasConversion<string>();

            modelBuilder.Entity<User>()
                .Property(u => u.InternationalPrefix)
                .HasConversion<string>();

            base.OnModelCreating(modelBuilder);
        }
    }
}
