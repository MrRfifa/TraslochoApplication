using System.Text;
using Backend.CachedRepositories;
using Backend.Data;
using Backend.Interfaces;
using Backend.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Scrutor;
using Swashbuckle.AspNetCore.Filters;

var builder = WebApplication.CreateBuilder(args);
// Load environment variables from .env file
DotNetEnv.Env.Load();

// Add services to the container.
builder.Services.AddControllers();

//Memory Cache Dependency Injection
// builder.Services.AddMemoryCache();

builder.Services.AddStackExchangeRedisCache(redisOptions =>
{

    string? connectionRedis = Environment.GetEnvironmentVariable("REDIS_CONNECTION_STRING");
    redisOptions.Configuration = connectionRedis;

});

//Dependency Injection
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ITokenRepository, TokenRepository>();
builder.Services.AddScoped<IReviewRepository, ReviewRepository>();
builder.Services.AddScoped<IRequestRepository, RequestRepository>();

// builder.Services.AddScoped<IShipmentRepository, ShipmentRepository>();

// Included redis memory cache for vehicle repo
builder.Services.AddScoped<IVehicleRepository, VehicleRepository>();
builder.Services.Decorate<IVehicleRepository, CachedVehicleRepository>();
// Included redis memory cache for shipment repo
builder.Services.AddScoped<IShipmentRepository, ShipmentRepository>();
builder.Services.Decorate<IShipmentRepository, CachedShipmentRepository>();
// Included redis memory cache for auth repo
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.Decorate<IAuthRepository, CachedAuthRepository>();

//TODO Reshape the backend so it becomes like "upwork"/"bolt"
//TODO Add a notification system using signalR if possible, else use any other solution (simple crud)

// Enable CORS
var corsOrigin = Environment.GetEnvironmentVariable("CORS");

if (corsOrigin != null)
{
    builder.Services.AddCors(options =>
{
    options.AddPolicy("PhotographOrigin", policy =>
    {
        policy.WithOrigins(corsOrigin).AllowAnyMethod().AllowAnyHeader();
    });
});
}
// Adding AutoMapper
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

//Adding Data Context
var DefaultConnection = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING");

builder.Services.AddDbContext<DataContext>(options =>
{
    options.UseSqlServer(DefaultConnection);
});

// Swagger/OpenAPI configuration
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
    {
        Description = "Standard Authorization header using the Bearer scheme (\"Bearer {token}\")",
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });
    options.OperationFilter<SecurityRequirementsOperationFilter>();
});

// Authentication and Authorization using JWT Bearer tokens
var jwtKey = builder.Configuration.GetSection("Jwt:Key").Value;

if (jwtKey != null)
{
    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });
}
else
{
    throw new Exception("JWT Key is not configured");
}

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    var context = services.GetRequiredService<DataContext>();
    if (context.Database.GetPendingMigrations().Any())
    {
        context.Database.Migrate();
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("PhotographOrigin");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
