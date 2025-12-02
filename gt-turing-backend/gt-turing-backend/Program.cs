using Microsoft.Extensions.FileProviders;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using gt_turing_backend.Data;
using gt_turing_backend.Services;
using gt_turing_backend.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Configure database - prefer SQLite file for local development (persistent)
var sqliteConn = builder.Configuration.GetConnectionString("Sqlite");
if (string.IsNullOrEmpty(sqliteConn))
{
    // default to local file in content root
    var dbPath = Path.Combine(Directory.GetCurrentDirectory(), "gt_turing.db");
    sqliteConn = $"Data Source={dbPath}";
}

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(sqliteConn));

// Add Services
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IAuthService, AuthService>();

// Add Controllers
builder.Services.AddControllers();

// Add CORS
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() 
    ?? new[] { "http://localhost:3000", "https://localhost:3000" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Add JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrEmpty(jwtKey))
{
    throw new InvalidOperationException("JWT Key is not configured");
}

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidateAudience = true,
        ValidAudience = builder.Configuration["Jwt:Audience"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("UserOrAdmin", policy => policy.RequireRole("User", "Admin"));
});

// Add SignalR for real-time chat
builder.Services.AddSignalR();

// Add Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "GT-TURING API",
        Version = "v1",
        Description = @"API REST para la plataforma de alquiler de coches de competición GT-TURING.
        
**Funcionalidades principales:**
- Autenticación JWT con roles (Visitor, User, Admin)
- Gestión de coches de competición (Racing, Drift, Hybrid)
- Gestión de circuitos españoles
- Sistema de reservas con validaciones
- Chat en tiempo real con SignalR
- Panel de administración completo

**Reglas de negocio:**
- Los coches Racing no pueden reservarse en circuitos de Hormigón (Concrete)
- Las reservas no pueden solaparse para el mismo coche
- Solo los administradores pueden confirmar/completar reservas
- Los usuarios solo ven sus propias reservas (los admin ven todas)",
        Contact = new OpenApiContact
        {
            Name = "GT-TURING Team",
            Email = "contact@gt-turing.com",
            Url = new Uri("https://github.com/cpifpalanturinges/proyectosintegrados-Juanjotg65")
        },
        License = new OpenApiLicense
        {
            Name = "Proyecto Integrado DAW 2024/2025",
        }
    });

    // Add JWT Authentication to Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = @"JWT Authorization header usando el esquema Bearer.
        
Ingresa 'Bearer' [espacio] y luego tu token en el campo de texto a continuación.

Ejemplo: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header
            },
            new List<string>()
        }
    });

    // Include XML comments if available
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }
});

var app = builder.Build();

// Seed database (AHORA CON IN-MEMORY DATABASE)
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();

        // If developer wants to force DB recreate for reseeding, set env var FORCE_DB_RECREATE=1
        var forceRecreate = Environment.GetEnvironmentVariable("FORCE_DB_RECREATE");
        if (!string.IsNullOrEmpty(forceRecreate) && forceRecreate == "1")
        {
            // Try to delete sqlite file if using sqlite
            try
            {
                var connString = builder.Configuration.GetConnectionString("Sqlite");
                if (string.IsNullOrEmpty(connString)) connString = $"Data Source={Path.Combine(Directory.GetCurrentDirectory(), "gt_turing.db")}";
                var parts = connString.Split('=', StringSplitOptions.RemoveEmptyEntries);
                if (parts.Length >= 2)
                {
                    var filePath = parts[1].Trim();
                    if (!Path.IsPathRooted(filePath)) filePath = Path.Combine(Directory.GetCurrentDirectory(), filePath);
                    if (File.Exists(filePath)) File.Delete(filePath);
                }
            }
            catch { /* ignore */ }
        }

        await DbSeeder.SeedAsync(context);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while seeding the database.");
    }
}

// Configure the HTTP request pipeline.

// Global exception handler (must be before other middleware)
app.UseGlobalExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "GT-TURING API V1");
        c.RoutePrefix = "swagger";
        c.DocumentTitle = "GT-TURING API Documentation";
        c.DefaultModelsExpandDepth(-1); // Hide schemas section by default
    });
}


// Serve static files from wwwroot/images at /images
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images")),
    RequestPath = "/images"
});

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

// Enable WebSockets
app.UseWebSockets();

// WebSocket Chat Middleware (before authentication)
app.UseWebSocketChat();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Map SignalR hubs
app.MapHub<gt_turing_backend.Hubs.ChatHub>("/hubs/chat");

app.Run();
