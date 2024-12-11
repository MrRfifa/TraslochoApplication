using System.Text;
using Backend.BackgroundServices;
using Backend.Cached;
using Backend.Data;
using Backend.Interfaces;
using Backend.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using StackExchange.Redis;
using Swashbuckle.AspNetCore.Filters;
// using Scrutor;
var builder = WebApplication.CreateBuilder(args);

// Load environment variables from .env file
DotNetEnv.Env.Load();

builder.Services.AddHttpClient();
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
// var jwtKey = builder.Configuration.GetSection("Jwt:Key").Value;
var jwtKey = Environment.GetEnvironmentVariable("JWT_TOKEN");

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

//Memory Cache Dependency Injection
// builder.Services.AddMemoryCache();
string? connectionRedis = Environment.GetEnvironmentVariable("REDIS_CONNECTION_STRING");
builder.Services.AddStackExchangeRedisCache(redisOptions =>
{
    redisOptions.Configuration = connectionRedis;
});

builder.Services.AddSingleton<IConnectionMultiplexer>(ConnectionMultiplexer.Connect(connectionRedis!)); // Adjust the connection string if necessary

// Register IDatabase
builder.Services.AddScoped<IDatabase>(provider =>
{
    var multiplexer = provider.GetRequiredService<IConnectionMultiplexer>();
    return multiplexer.GetDatabase();
});
//Background service : Cron job for updating shipment status
builder.Services.AddHostedService<ShipmentStatusUpdateService>();


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// Add services to the container.
builder.Services.AddControllers();

// Add services to the container.
//Dependency Injection
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ITokenRepository, TokenRepository>();
builder.Services.AddScoped<IVehicleRepository, VehicleRepository>();
builder.Services.AddScoped<IShipmentRepository, ShipmentRepository>();
builder.Services.AddScoped<IRequestRepository, RequestRepository>();
builder.Services.AddScoped<IReviewRepository, ReviewRepository>();
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();
builder.Services.AddScoped<IUserStatisticsRepository, UserStatisticsRepository>();

//TODO add these caches
// builder.Services.AddScoped<IVehicleRepository, VehicleRepository>();
// builder.Services.Decorate<IVehicleRepository, CachedVehicleRepository>();
builder.Services.Decorate<IAuthRepository, CachedAuthRepository>();
builder.Services.Decorate<IShipmentRepository, CachedShipmentRepository>();
builder.Services.Decorate<IRequestRepository, CachedRequestRepository>();

// Adding AutoMapper
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

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

//Adding Data Context
var DefaultConnection = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING");

builder.Services.AddControllers().AddNewtonsoftJson(options =>
{
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
});

builder.Services.AddDbContext<ApplicationDBContext>(options =>
{
    options.UseSqlServer(DefaultConnection);
});

var app = builder.Build();

//auto migrate when dockerize
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    var context = services.GetRequiredService<ApplicationDBContext>();
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

