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
    [DbContext(typeof(ApplicationDBContext))]
    [Migration("20240925142510_ReviewTableFixed")]
    partial class ReviewTableFixed
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.8")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Backend.Models.Classes.AddressesEntities.Address", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("City")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Country")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Discriminator")
                        .IsRequired()
                        .HasMaxLength(21)
                        .HasColumnType("nvarchar(21)");

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

                    b.HasDiscriminator().HasValue("Address");

                    b.UseTphMappingStrategy();
                });

            modelBuilder.Entity("Backend.Models.Classes.ImagesEntities.ImageFile", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Discriminator")
                        .IsRequired()
                        .HasMaxLength(13)
                        .HasColumnType("nvarchar(13)");

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

                    b.HasDiscriminator().HasValue("ImageFile");

                    b.UseTphMappingStrategy();
                });

            modelBuilder.Entity("Backend.Models.Classes.Request", b =>
                {
                    b.Property<int>("RequestId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("RequestId"));

                    b.Property<int>("ShipmentId")
                        .HasColumnType("int");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("TransporterId")
                        .HasColumnType("int");

                    b.HasKey("RequestId");

                    b.HasIndex("ShipmentId");

                    b.HasIndex("TransporterId");

                    b.ToTable("Requests");
                });

            modelBuilder.Entity("Backend.Models.Classes.Review", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Comment")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("OwnerId")
                        .HasColumnType("int");

                    b.Property<int>("Rating")
                        .HasColumnType("int");

                    b.Property<DateTime>("ReviewTime")
                        .HasColumnType("datetime2");

                    b.Property<string>("Sentiment")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("TransporterId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("OwnerId");

                    b.HasIndex("TransporterId");

                    b.ToTable("Reviews");
                });

            modelBuilder.Entity("Backend.Models.Classes.Shipment", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("DestinationAddressId")
                        .HasColumnType("int");

                    b.Property<float>("DistanceBetweenAddresses")
                        .HasColumnType("real");

                    b.Property<int?>("OriginAddressId")
                        .HasColumnType("int");

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

                    b.Property<int?>("TransporterId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("DestinationAddressId");

                    b.HasIndex("OriginAddressId");

                    b.HasIndex("OwnerId");

                    b.HasIndex("TransporterId");

                    b.ToTable("Shipments");
                });

            modelBuilder.Entity("Backend.Models.Classes.UserToken", b =>
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

            modelBuilder.Entity("Backend.Models.Classes.UsersEntities.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("DateOfBirth")
                        .HasColumnType("datetime2");

                    b.Property<string>("Discriminator")
                        .IsRequired()
                        .HasMaxLength(13)
                        .HasColumnType("nvarchar(13)");

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

                    b.Property<int>("InternationalPrefix")
                        .HasColumnType("int");

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

                    b.HasDiscriminator().HasValue("User");

                    b.UseTphMappingStrategy();
                });

            modelBuilder.Entity("Backend.Models.Classes.Vehicle", b =>
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

                    b.HasIndex("TransporterId")
                        .IsUnique();

                    b.ToTable("Vehicles");
                });

            modelBuilder.Entity("Backend.Models.Classes.AddressesEntities.ShipmentAddress", b =>
                {
                    b.HasBaseType("Backend.Models.Classes.AddressesEntities.Address");

                    b.Property<int>("ShipmentId")
                        .HasColumnType("int");

                    b.HasIndex("ShipmentId");

                    b.HasDiscriminator().HasValue("ShipmentAddress");
                });

            modelBuilder.Entity("Backend.Models.Classes.AddressesEntities.UserAddress", b =>
                {
                    b.HasBaseType("Backend.Models.Classes.AddressesEntities.Address");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasIndex("UserId")
                        .IsUnique()
                        .HasFilter("[UserId] IS NOT NULL");

                    b.HasDiscriminator().HasValue("UserAddress");
                });

            modelBuilder.Entity("Backend.Models.Classes.ImagesEntities.ShipmentImage", b =>
                {
                    b.HasBaseType("Backend.Models.Classes.ImagesEntities.ImageFile");

                    b.Property<int>("ShipmentId")
                        .HasColumnType("int");

                    b.HasIndex("ShipmentId");

                    b.HasDiscriminator().HasValue("ShipmentImage");
                });

            modelBuilder.Entity("Backend.Models.Classes.ImagesEntities.VehicleImage", b =>
                {
                    b.HasBaseType("Backend.Models.Classes.ImagesEntities.ImageFile");

                    b.Property<int>("VehicleId")
                        .HasColumnType("int");

                    b.HasIndex("VehicleId");

                    b.HasDiscriminator().HasValue("VehicleImage");
                });

            modelBuilder.Entity("Backend.Models.Classes.UsersEntities.Owner", b =>
                {
                    b.HasBaseType("Backend.Models.Classes.UsersEntities.User");

                    b.HasDiscriminator().HasValue("Owner");
                });

            modelBuilder.Entity("Backend.Models.Classes.UsersEntities.Transporter", b =>
                {
                    b.HasBaseType("Backend.Models.Classes.UsersEntities.User");

                    b.Property<int>("TransporterType")
                        .HasColumnType("int");

                    b.HasDiscriminator().HasValue("Transporter");
                });

            modelBuilder.Entity("Backend.Models.Classes.Request", b =>
                {
                    b.HasOne("Backend.Models.Classes.Shipment", "Shipment")
                        .WithMany("Requests")
                        .HasForeignKey("ShipmentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Backend.Models.Classes.UsersEntities.Transporter", "Transporter")
                        .WithMany("Requests")
                        .HasForeignKey("TransporterId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Shipment");

                    b.Navigation("Transporter");
                });

            modelBuilder.Entity("Backend.Models.Classes.Review", b =>
                {
                    b.HasOne("Backend.Models.Classes.UsersEntities.Owner", "Owner")
                        .WithMany("OwnerReviews")
                        .HasForeignKey("OwnerId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("Backend.Models.Classes.UsersEntities.Transporter", "Transporter")
                        .WithMany("TransporterReviews")
                        .HasForeignKey("TransporterId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Owner");

                    b.Navigation("Transporter");
                });

            modelBuilder.Entity("Backend.Models.Classes.Shipment", b =>
                {
                    b.HasOne("Backend.Models.Classes.AddressesEntities.ShipmentAddress", "DestinationAddress")
                        .WithMany()
                        .HasForeignKey("DestinationAddressId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("Backend.Models.Classes.AddressesEntities.ShipmentAddress", "OriginAddress")
                        .WithMany()
                        .HasForeignKey("OriginAddressId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("Backend.Models.Classes.UsersEntities.Owner", "Owner")
                        .WithMany("Shipments")
                        .HasForeignKey("OwnerId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("Backend.Models.Classes.UsersEntities.Transporter", "Transporter")
                        .WithMany("Shipments")
                        .HasForeignKey("TransporterId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.Navigation("DestinationAddress");

                    b.Navigation("OriginAddress");

                    b.Navigation("Owner");

                    b.Navigation("Transporter");
                });

            modelBuilder.Entity("Backend.Models.Classes.UsersEntities.User", b =>
                {
                    b.HasOne("Backend.Models.Classes.UserToken", "UserTokens")
                        .WithMany()
                        .HasForeignKey("UserTokensId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("UserTokens");
                });

            modelBuilder.Entity("Backend.Models.Classes.Vehicle", b =>
                {
                    b.HasOne("Backend.Models.Classes.UsersEntities.Transporter", "Transporter")
                        .WithOne("Vehicle")
                        .HasForeignKey("Backend.Models.Classes.Vehicle", "TransporterId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Transporter");
                });

            modelBuilder.Entity("Backend.Models.Classes.AddressesEntities.ShipmentAddress", b =>
                {
                    b.HasOne("Backend.Models.Classes.Shipment", "Shipment")
                        .WithMany()
                        .HasForeignKey("ShipmentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Shipment");
                });

            modelBuilder.Entity("Backend.Models.Classes.AddressesEntities.UserAddress", b =>
                {
                    b.HasOne("Backend.Models.Classes.UsersEntities.User", "User")
                        .WithOne("UserAddress")
                        .HasForeignKey("Backend.Models.Classes.AddressesEntities.UserAddress", "UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("Backend.Models.Classes.ImagesEntities.ShipmentImage", b =>
                {
                    b.HasOne("Backend.Models.Classes.Shipment", "Shipment")
                        .WithMany("Images")
                        .HasForeignKey("ShipmentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Shipment");
                });

            modelBuilder.Entity("Backend.Models.Classes.ImagesEntities.VehicleImage", b =>
                {
                    b.HasOne("Backend.Models.Classes.Vehicle", "Vehicle")
                        .WithMany("VehicleImages")
                        .HasForeignKey("VehicleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Vehicle");
                });

            modelBuilder.Entity("Backend.Models.Classes.Shipment", b =>
                {
                    b.Navigation("Images");

                    b.Navigation("Requests");
                });

            modelBuilder.Entity("Backend.Models.Classes.UsersEntities.User", b =>
                {
                    b.Navigation("UserAddress")
                        .IsRequired();
                });

            modelBuilder.Entity("Backend.Models.Classes.Vehicle", b =>
                {
                    b.Navigation("VehicleImages");
                });

            modelBuilder.Entity("Backend.Models.Classes.UsersEntities.Owner", b =>
                {
                    b.Navigation("OwnerReviews");

                    b.Navigation("Shipments");
                });

            modelBuilder.Entity("Backend.Models.Classes.UsersEntities.Transporter", b =>
                {
                    b.Navigation("Requests");

                    b.Navigation("Shipments");

                    b.Navigation("TransporterReviews");

                    b.Navigation("Vehicle");
                });
#pragma warning restore 612, 618
        }
    }
}
