using System.Text;
using Backend.Data;
using Backend.Interfaces;
using Backend.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

//
builder.Services.AddSignalR();

//Dependency Injection
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ITokenRepository, TokenRepository>();
builder.Services.AddScoped<IVehicleRepository, VehicleRepository>();
builder.Services.AddScoped<IShipmentRepository, ShipmentRepository>();

// Load environment variables from .env file
DotNetEnv.Env.Load();

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
        // options.Events = new JwtBearerEvents
        // {
        //     OnMessageReceived = context =>
        //     {
        //         var accessToken = context.Request.Query["access_token"];
        //         var path = context.HttpContext.Request.Path;
        //         if (!string.IsNullOrEmpty(accessToken)
        //             && path.StartsWithSegments("/chathub"))
        //         {
        //             context.Token = accessToken;
        //         }
        //         return Task.CompletedTask;
        //     }
        // };
    });
}
else
{
    throw new Exception("JWT Key is not configured");
}

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
<<<<<<< Updated upstream
=======
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
>>>>>>> Stashed changes

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

//signal R

// app.MapHub<ChatHub>("chat");

app.UseHttpsRedirection();

app.UseCors("PhotographOrigin");
app.UseRouting();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();
app.MapHub<ShipmentStatusHub>("/shipment-status-update");
// app.UseEndpoints(endpoints =>
//     {
//         endpoints.MapHub<ChatHub>("/chathub");
//         endpoints.MapControllers();
//     });

app.Run();
