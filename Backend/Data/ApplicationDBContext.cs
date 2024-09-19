using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Models.Classes;
using Backend.Models.Classes.AddressesEntities;
using Backend.Models.Classes.ImagesEntities;
using Backend.Models.Classes.UsersEntities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class ApplicationDBContext : DbContext
    {
        public ApplicationDBContext(DbContextOptions dbContextOptions) : base(dbContextOptions)
        {

        }
        public DbSet<Address> Addresses { get; set; }
        public DbSet<UserAddress> UserAddresses { get; set; }
        public DbSet<ShipmentAddress> ShipmentAddresses { get; set; }
        public DbSet<Owner> Owners { get; set; }
        public DbSet<Shipment> Shipments { get; set; }
        public DbSet<Transporter> Transporters { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<UserToken> UserTokens { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<ImageFile> Images { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Request> Requests { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configuring User relationships
            modelBuilder.Entity<User>()
                .HasOne(u => u.UserAddress)
                .WithOne(a => a.User)
                .HasForeignKey<UserAddress>(ua => ua.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configuring Owner-Shipments relationships (One-to-Many)
            modelBuilder.Entity<Owner>()
                .HasMany(o => o.Shipments)
                .WithOne(s => s.Owner)
                .HasForeignKey(s => s.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configuring Request-Shipment relationship (Many-to-One)
            modelBuilder.Entity<Request>()
                .HasOne(r => r.Shipment)
                .WithMany(s => s.Requests)
                .HasForeignKey(r => r.ShipmentId);

            // Configuring Request-Transporter relationship (Many-to-One)
            modelBuilder.Entity<Request>()
                .HasOne(r => r.Transporter)
                .WithMany(t => t.Requests)
                .HasForeignKey(r => r.TransporterId);

            // Configuring RequestId as the primary key
            modelBuilder.Entity<Request>()
                .HasKey(r => r.RequestId);

            // Auto-generate the RequestId
            modelBuilder.Entity<Request>()
                .Property(r => r.RequestId)
                .ValueGeneratedOnAdd(); // Ensure RequestId is auto-generated

            // Configuring Transporter-Shipments relationships (One-to-Many)
            modelBuilder.Entity<Transporter>()
                .HasMany(t => t.Shipments)
                .WithOne(s => s.Transporter)
                .HasForeignKey(s => s.TransporterId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Shipment>()
                .HasOne(s => s.OriginAddress)
                .WithMany()  // ShipmentAddress does not need to reference Shipment
                .HasForeignKey(s => s.OriginAddressId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Shipment>()
                .HasOne(s => s.DestinationAddress)
                .WithMany()  // ShipmentAddress does not need to reference Shipment
                .HasForeignKey(s => s.DestinationAddressId)
                .OnDelete(DeleteBehavior.Restrict);



            // Configuring Transporter-Vehicle relationships (One-to-One)
            modelBuilder.Entity<Transporter>()
                .HasOne(t => t.Vehicle)
                .WithOne(v => v.Transporter)
                .HasForeignKey<Vehicle>(v => v.TransporterId);

            // Configuring Shipment-Images relationships (One-to-Many)
            modelBuilder.Entity<Shipment>()
                .HasMany(s => s.Images)
                .WithOne(si => si.Shipment)
                .HasForeignKey(si => si.ShipmentId);

            // Configuring Vehicle-Images relationships (One-to-Many)
            modelBuilder.Entity<Vehicle>()
                .HasMany(s => s.VehicleImages)
                .WithOne(si => si.Vehicle)
                .HasForeignKey(si => si.VehicleId);

            // Configuring Reviews (One-to-Many for both Owner and Transporter)
            modelBuilder.Entity<Review>()
                .HasOne(r => r.Owner)
                .WithMany(o => o.OwnerReviews)
                .HasForeignKey(r => r.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.Transporter)
                .WithMany(t => t.TransporterReviews)
                .HasForeignKey(r => r.TransporterId)
                .OnDelete(DeleteBehavior.Restrict);

            // enum conversions

            modelBuilder.Entity<Request>()
                .Property(r => r.Status)
                .HasConversion<string>();

            modelBuilder.Entity<Vehicle>()
                .Property(r => r.VehicleType)
                .HasConversion<string>();

            modelBuilder.Entity<Shipment>()
                .Property(r => r.ShipmentType)
                .HasConversion<string>();

            modelBuilder.Entity<Shipment>()
                .Property(r => r.ShipmentStatus)
                .HasConversion<string>();

            modelBuilder.Entity<User>()
                .Property(r => r.Role)
                .HasConversion<string>();

            modelBuilder.Entity<Address>()
                .Property(r => r.Country)
                .HasConversion<string>();
        }

    }
}