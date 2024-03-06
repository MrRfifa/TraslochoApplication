﻿// <auto-generated />
using System;
using Backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Backend.Migrations
{
    [DbContext(typeof(DataContext))]
    [Migration("20240229102637_initialMigration")]
    partial class initialMigration
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.13")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Backend.Models.classes.Address", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("City")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Country")
                        .HasColumnType("int");

                    b.Property<string>("Discriminator")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PostalCode")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("State")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Street")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Addresses");

                    b.HasDiscriminator<string>("Discriminator").HasValue("Address");

                    b.UseTphMappingStrategy();
                });

            modelBuilder.Entity("Backend.Models.classes.ImageFile", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Discriminator")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<byte[]>("FileContentBase64")
                        .IsRequired()
                        .HasColumnType("varbinary(max)");

                    b.Property<string>("FileName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("UploadDate")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.ToTable("Images");

                    b.HasDiscriminator<string>("Discriminator").HasValue("ImageFile");

                    b.UseTphMappingStrategy();
                });

            modelBuilder.Entity("Backend.Models.classes.OwnerShipment", b =>
                {
                    b.Property<int>("OwnerShipmentId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("OwnerShipmentId"));

                    b.Property<int>("OwnerId")
                        .HasColumnType("int");

                    b.Property<int>("ShipmentId")
                        .HasColumnType("int");

                    b.Property<int>("ShipmentStatus")
                        .HasColumnType("int");

                    b.Property<int>("VehicleId")
                        .HasColumnType("int");

                    b.HasKey("OwnerShipmentId");

                    b.HasIndex("OwnerId");

                    b.HasIndex("ShipmentId");

                    b.HasIndex("VehicleId");

                    b.ToTable("OwnerShipments");
                });

            modelBuilder.Entity("Backend.Models.classes.Shipment", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<float>("DistanceBetweenAddresses")
                        .HasColumnType("real");

                    b.Property<int>("OwnerId")
                        .HasColumnType("int");

                    b.Property<int>("Price")
                        .HasColumnType("int");

                    b.Property<DateTime>("ShipmentDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("ShipmentStatus")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ShipmentType")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("TransporterId")
                        .HasColumnType("int");

                    b.Property<int>("VehicleId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("OwnerId");

                    b.HasIndex("TransporterId");

                    b.HasIndex("VehicleId");

                    b.ToTable("Shipments");
                });

            modelBuilder.Entity("Backend.Models.classes.TransporterShipment", b =>
                {
                    b.Property<int>("TransporterShipmentId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("TransporterShipmentId"));

                    b.Property<int>("ShipmentId")
                        .HasColumnType("int");

                    b.Property<int>("ShipmentStatus")
                        .HasColumnType("int");

                    b.Property<int>("TransporterId")
                        .HasColumnType("int");

                    b.Property<int>("VehicleId")
                        .HasColumnType("int");

                    b.HasKey("TransporterShipmentId");

                    b.HasIndex("ShipmentId");

                    b.HasIndex("TransporterId");

                    b.HasIndex("VehicleId");

                    b.ToTable("TransporterShipments");
                });

            modelBuilder.Entity("Backend.Models.classes.UserTokens", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("DeleteAccountToken")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("DeleteAccountTokenExpires")
                        .HasColumnType("datetime2");

                    b.Property<string>("EmailChangeToken")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("EmailChangeTokenExpires")
                        .HasColumnType("datetime2");

                    b.Property<string>("NewEmail")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PasswordResetToken")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("ResetTokenExpires")
                        .HasColumnType("datetime2");

                    b.Property<string>("VerificationToken")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("VerifiedAt")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.ToTable("UserTokens");
                });

            modelBuilder.Entity("Backend.Models.classes.UsersEntities.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("DateOfBirth")
                        .HasColumnType("datetime2");

                    b.Property<string>("Discriminator")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<byte[]>("FileContentBase64")
                        .IsRequired()
                        .HasColumnType("varbinary(max)");

                    b.Property<string>("FileName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("InternationalPrefix")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<byte[]>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("varbinary(max)");

                    b.Property<byte[]>("PasswordSalt")
                        .IsRequired()
                        .HasColumnType("varbinary(max)");

                    b.Property<string>("PhoneNumber")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Role")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("UserTokensId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("UserTokensId");

                    b.ToTable("Users");

                    b.HasDiscriminator<string>("Discriminator").HasValue("User");

                    b.UseTphMappingStrategy();
                });

            modelBuilder.Entity("Backend.Models.classes.Vehicle", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Color")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<float>("Height")
                        .HasColumnType("real");

                    b.Property<bool>("IsAvailable")
                        .HasColumnType("bit");

                    b.Property<float>("Length")
                        .HasColumnType("real");

                    b.Property<string>("Manufacture")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Model")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("TransporterId")
                        .HasColumnType("int");

                    b.Property<string>("VehicleType")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Year")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("TransporterId");

                    b.ToTable("Vehicles");
                });

            modelBuilder.Entity("Backend.Models.classes.ShipmentAddress", b =>
                {
                    b.HasBaseType("Backend.Models.classes.Address");

                    b.Property<int>("ShipmentId")
                        .HasColumnType("int");

                    b.HasIndex("ShipmentId")
                        .IsUnique()
                        .HasFilter("[ShipmentId] IS NOT NULL");

                    b.HasDiscriminator().HasValue("ShipmentAddress");
                });

            modelBuilder.Entity("Backend.Models.classes.UserAddress", b =>
                {
                    b.HasBaseType("Backend.Models.classes.Address");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasIndex("UserId")
                        .IsUnique()
                        .HasFilter("[UserId] IS NOT NULL");

                    b.HasDiscriminator().HasValue("UserAddress");
                });

            modelBuilder.Entity("Backend.Models.classes.ShipmentImage", b =>
                {
                    b.HasBaseType("Backend.Models.classes.ImageFile");

                    b.Property<int>("ShipmentId")
                        .HasColumnType("int");

                    b.HasIndex("ShipmentId");

                    b.HasDiscriminator().HasValue("ShipmentImage");
                });

            modelBuilder.Entity("Backend.Models.classes.VehicleImage", b =>
                {
                    b.HasBaseType("Backend.Models.classes.ImageFile");

                    b.Property<int>("VehicleId")
                        .HasColumnType("int");

                    b.HasIndex("VehicleId");

                    b.HasDiscriminator().HasValue("VehicleImage");
                });

            modelBuilder.Entity("Backend.Models.classes.UsersEntities.Owner", b =>
                {
                    b.HasBaseType("Backend.Models.classes.UsersEntities.User");

                    b.HasDiscriminator().HasValue("Owner");
                });

            modelBuilder.Entity("Backend.Models.classes.UsersEntities.Transporter", b =>
                {
                    b.HasBaseType("Backend.Models.classes.UsersEntities.User");

                    b.Property<string>("TransporterType")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasDiscriminator().HasValue("Transporter");
                });

            modelBuilder.Entity("Backend.Models.classes.OwnerShipment", b =>
                {
                    b.HasOne("Backend.Models.classes.UsersEntities.Owner", "Owner")
                        .WithMany("OwnerShipments")
                        .HasForeignKey("OwnerId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("Backend.Models.classes.Shipment", "Shipment")
                        .WithMany("OwnerShipments")
                        .HasForeignKey("ShipmentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Backend.Models.classes.Vehicle", "Vehicle")
                        .WithMany("OwnerShipments")
                        .HasForeignKey("VehicleId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Owner");

                    b.Navigation("Shipment");

                    b.Navigation("Vehicle");
                });

            modelBuilder.Entity("Backend.Models.classes.Shipment", b =>
                {
                    b.HasOne("Backend.Models.classes.UsersEntities.Owner", "Owner")
                        .WithMany("Shipments")
                        .HasForeignKey("OwnerId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("Backend.Models.classes.UsersEntities.Transporter", "Transporter")
                        .WithMany("Shipments")
                        .HasForeignKey("TransporterId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("Backend.Models.classes.Vehicle", "Vehicle")
                        .WithMany()
                        .HasForeignKey("VehicleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Owner");

                    b.Navigation("Transporter");

                    b.Navigation("Vehicle");
                });

            modelBuilder.Entity("Backend.Models.classes.TransporterShipment", b =>
                {
                    b.HasOne("Backend.Models.classes.Shipment", "Shipment")
                        .WithMany("TransporterShipments")
                        .HasForeignKey("ShipmentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Backend.Models.classes.UsersEntities.Transporter", "Transporter")
                        .WithMany("TransporterShipments")
                        .HasForeignKey("TransporterId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("Backend.Models.classes.Vehicle", "Vehicle")
                        .WithMany("TransporterShipments")
                        .HasForeignKey("VehicleId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Shipment");

                    b.Navigation("Transporter");

                    b.Navigation("Vehicle");
                });

            modelBuilder.Entity("Backend.Models.classes.UsersEntities.User", b =>
                {
                    b.HasOne("Backend.Models.classes.UserTokens", "UserTokens")
                        .WithMany()
                        .HasForeignKey("UserTokensId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("UserTokens");
                });

            modelBuilder.Entity("Backend.Models.classes.Vehicle", b =>
                {
                    b.HasOne("Backend.Models.classes.UsersEntities.Transporter", "Transporter")
                        .WithMany("Vehicles")
                        .HasForeignKey("TransporterId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Transporter");
                });

            modelBuilder.Entity("Backend.Models.classes.ShipmentAddress", b =>
                {
                    b.HasOne("Backend.Models.classes.Shipment", null)
                        .WithOne("DestinationAddress")
                        .HasForeignKey("Backend.Models.classes.ShipmentAddress", "ShipmentId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                });

            modelBuilder.Entity("Backend.Models.classes.UserAddress", b =>
                {
                    b.HasOne("Backend.Models.classes.UsersEntities.User", null)
                        .WithOne("UserAddress")
                        .HasForeignKey("Backend.Models.classes.UserAddress", "UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                });

            modelBuilder.Entity("Backend.Models.classes.ShipmentImage", b =>
                {
                    b.HasOne("Backend.Models.classes.Shipment", null)
                        .WithMany("Images")
                        .HasForeignKey("ShipmentId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                });

            modelBuilder.Entity("Backend.Models.classes.VehicleImage", b =>
                {
                    b.HasOne("Backend.Models.classes.Vehicle", null)
                        .WithMany("VehicleImages")
                        .HasForeignKey("VehicleId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                });

            modelBuilder.Entity("Backend.Models.classes.Shipment", b =>
                {
                    b.Navigation("DestinationAddress")
                        .IsRequired();

                    b.Navigation("Images");

                    b.Navigation("OwnerShipments");

                    b.Navigation("TransporterShipments");
                });

            modelBuilder.Entity("Backend.Models.classes.UsersEntities.User", b =>
                {
                    b.Navigation("UserAddress")
                        .IsRequired();
                });

            modelBuilder.Entity("Backend.Models.classes.Vehicle", b =>
                {
                    b.Navigation("OwnerShipments");

                    b.Navigation("TransporterShipments");

                    b.Navigation("VehicleImages");
                });

            modelBuilder.Entity("Backend.Models.classes.UsersEntities.Owner", b =>
                {
                    b.Navigation("OwnerShipments");

                    b.Navigation("Shipments");
                });

            modelBuilder.Entity("Backend.Models.classes.UsersEntities.Transporter", b =>
                {
                    b.Navigation("Shipments");

                    b.Navigation("TransporterShipments");

                    b.Navigation("Vehicles");
                });
#pragma warning restore 612, 618
        }
    }
}