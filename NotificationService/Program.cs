using NotificationService.Hub;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

// Load environment variables from .env file
DotNetEnv.Env.Load();

builder.Services.AddControllers();  // Add controllers
builder.Services.AddSignalR();      // Add SignalR

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", builder =>
    {
        builder.WithOrigins("http://localhost:5173")  // Your React app URL
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials(); // Allow credentials for SignalR
    });
});

// Register Redis connection
string? connectionRedis = Environment.GetEnvironmentVariable("REDIS_CONNECTION_STRING");
builder.Services.AddSingleton<IConnectionMultiplexer>(ConnectionMultiplexer.Connect(connectionRedis!)); // Adjust the connection string if necessary


var app = builder.Build();

// Use CORS middleware before routing
app.UseCors("CorsPolicy");

app.UseRouting();

// Map SignalR hubs
app.MapHub<NotificationHub>("/notificationHub");  // Your SignalR hub route

// Map controllers
app.MapControllers();  // Ensure controllers are mapped

app.Run();