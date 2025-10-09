using gt_turing_backend.Data;
using gt_turing_backend.Models;
using Microsoft.EntityFrameworkCore;

namespace gt_turing_backend.Data
{
    /// <summary>
    /// Database seeder for initial data
    /// Sembrador de base de datos para datos iniciales
    /// </summary>
    public static class DbSeeder
    {
        public static async Task SeedAsync(AppDbContext context)
        {
            // Ensure database is created
            await context.Database.EnsureCreatedAsync();

            // Check if data already exists
            if (await context.Users.AnyAsync())
            {
                return; // Database already seeded
            }

            // Seed Admin User
            var adminUser = new User
            {
                Id = Guid.NewGuid(),
                Email = "admin@gt-turing.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                FirstName = "Admin",
                LastName = "GT-TURING",
                Phone = "+34 600 000 000",
                Role = UserRole.Admin,
                IsBlocked = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // Seed Test Users
            var testUser1 = new User
            {
                Id = Guid.NewGuid(),
                Email = "juan@test.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Test123!"),
                FirstName = "Juan",
                LastName = "García",
                Phone = "+34 611 111 111",
                Role = UserRole.User,
                IsBlocked = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var testUser2 = new User
            {
                Id = Guid.NewGuid(),
                Email = "maria@test.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Test123!"),
                FirstName = "María",
                LastName = "López",
                Phone = "+34 622 222 222",
                Role = UserRole.User,
                IsBlocked = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            context.Users.AddRange(adminUser, testUser1, testUser2);

            // Seed Spanish Circuits
            var circuits = new List<Circuit>
            {
                new Circuit
                {
                    Id = Guid.NewGuid(),
                    Name = "Circuit de Barcelona-Catalunya",
                    Location = "Montmeló, Barcelona",
                    Province = "Barcelona",
                    LengthMeters = 4675,
                    WidthMeters = 12,
                    SurfaceType = SurfaceType.Asphalt,
                    ElevationChange = 31,
                    NumberOfCorners = 16,
                    IsAvailable = true,
                    ImageUrl = "/images/circuits/barcelona.jpg",
                    Description = "Circuito de Fórmula 1 y MotoGP con configuraciones múltiples. Sede del Gran Premio de España.",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Circuit
                {
                    Id = Guid.NewGuid(),
                    Name = "Circuito del Jarama",
                    Location = "San Sebastián de los Reyes, Madrid",
                    Province = "Madrid",
                    LengthMeters = 3850,
                    WidthMeters = 10,
                    SurfaceType = SurfaceType.Asphalt,
                    ElevationChange = 25,
                    NumberOfCorners = 13,
                    IsAvailable = true,
                    ImageUrl = "/images/circuits/jarama.jpg",
                    Description = "Histórico circuito español, sede de varios Grandes Premios de Fórmula 1 en los años 70 y 80.",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Circuit
                {
                    Id = Guid.NewGuid(),
                    Name = "Circuito de Jerez - Ángel Nieto",
                    Location = "Jerez de la Frontera, Cádiz",
                    Province = "Cádiz",
                    LengthMeters = 4423,
                    WidthMeters = 11,
                    SurfaceType = SurfaceType.Asphalt,
                    ElevationChange = 15,
                    NumberOfCorners = 13,
                    IsAvailable = true,
                    ImageUrl = "/images/circuits/jerez.jpg",
                    Description = "Circuito de MotoGP y pruebas de Fórmula 1. Famoso por su curva final y ambiente andaluz.",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Circuit
                {
                    Id = Guid.NewGuid(),
                    Name = "Motorland Aragón",
                    Location = "Alcañiz, Teruel",
                    Province = "Teruel",
                    LengthMeters = 5344,
                    WidthMeters = 12,
                    SurfaceType = SurfaceType.Asphalt,
                    ElevationChange = 45,
                    NumberOfCorners = 17,
                    IsAvailable = true,
                    ImageUrl = "/images/circuits/motorland.jpg",
                    Description = "Circuito moderno de MotoGP con gran desnivel y curvas técnicas.",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Circuit
                {
                    Id = Guid.NewGuid(),
                    Name = "Circuito de Navarra - Los Arcos",
                    Location = "Los Arcos, Navarra",
                    Province = "Navarra",
                    LengthMeters = 3933,
                    WidthMeters = 12,
                    SurfaceType = SurfaceType.Asphalt,
                    ElevationChange = 52,
                    NumberOfCorners = 15,
                    IsAvailable = true,
                    ImageUrl = "/images/circuits/navarra.jpg",
                    Description = "Circuito técnico con gran variedad de curvas y buen desnivel.",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Circuit
                {
                    Id = Guid.NewGuid(),
                    Name = "Circuit Ricardo Tormo - Cheste",
                    Location = "Cheste, Valencia",
                    Province = "Valencia",
                    LengthMeters = 4005,
                    WidthMeters = 12,
                    SurfaceType = SurfaceType.Asphalt,
                    ElevationChange = 38,
                    NumberOfCorners = 14,
                    IsAvailable = true,
                    ImageUrl = "/images/circuits/cheste.jpg",
                    Description = "Circuito de MotoGP que cierra la temporada. Sede del Gran Premio de la Comunitat Valenciana.",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Circuit
                {
                    Id = Guid.NewGuid(),
                    Name = "Parcmotor Castellolí",
                    Location = "Castellolí, Barcelona",
                    Province = "Barcelona",
                    LengthMeters = 3700,
                    WidthMeters = 10,
                    SurfaceType = SurfaceType.Asphalt,
                    ElevationChange = 60,
                    NumberOfCorners = 16,
                    IsAvailable = true,
                    ImageUrl = "/images/circuits/castelloli.jpg",
                    Description = "Circuito con gran desnivel y curvas rápidas. Ideal para drift y competición.",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Circuit
                {
                    Id = Guid.NewGuid(),
                    Name = "Autódromo de Sitges-Terramar",
                    Location = "Sitges, Barcelona",
                    Province = "Barcelona",
                    LengthMeters = 2030,
                    WidthMeters = 8,
                    SurfaceType = SurfaceType.Asphalt,
                    ElevationChange = 10,
                    NumberOfCorners = 6,
                    IsAvailable = false,
                    ImageUrl = "/images/circuits/sitges.jpg",
                    Description = "Histórico circuito de 1923. Actualmente en restauración. Oval único en España.",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            };

            context.Circuits.AddRange(circuits);

            // Seed Competition Cars
            var cars = new List<Car>
            {
                // Racing Cars
                new Car
                {
                    Id = Guid.NewGuid(),
                    Brand = "Nissan",
                    Model = "GT-R R35 Nismo",
                    Year = 2022,
                    Power = 600,
                    Type = CarType.Racing,
                    PricePerDay = 850,
                    Status = CarStatus.Available,
                    ImageUrl = "/images/cars/gtr-r35.jpg",
                    Description = "El icónico GT-R preparado para competición con 600 CV. Ideal para circuito.",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Car
                {
                    Id = Guid.NewGuid(),
                    Brand = "Porsche",
                    Model = "911 GT3 RS",
                    Year = 2023,
                    Power = 525,
                    Type = CarType.Racing,
                    PricePerDay = 1200,
                    Status = CarStatus.Available,
                    ImageUrl = "/images/cars/911-gt3rs.jpg",
                    Description = "El máximo exponente de Porsche en circuito. Motor atmosférico de 525 CV.",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Car
                {
                    Id = Guid.NewGuid(),
                    Brand = "BMW",
                    Model = "M4 Competition",
                    Year = 2023,
                    Power = 510,
                    Type = CarType.Racing,
                    PricePerDay = 750,
                    Status = CarStatus.Available,
                    ImageUrl = "/images/cars/m4-comp.jpg",
                    Description = "BMW M4 con 510 CV y tracción trasera. Perfecto equilibrio entre potencia y control.",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Car
                {
                    Id = Guid.NewGuid(),
                    Brand = "Ferrari",
                    Model = "488 Challenge",
                    Year = 2021,
                    Power = 670,
                    Type = CarType.Racing,
                    PricePerDay = 1800,
                    Status = CarStatus.Available,
                    ImageUrl = "/images/cars/488-challenge.jpg",
                    Description = "Ferrari de competición pura. 670 CV de emociones italianas en circuito.",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Car
                {
                    Id = Guid.NewGuid(),
                    Brand = "McLaren",
                    Model = "720S GT3",
                    Year = 2022,
                    Power = 720,
                    Type = CarType.Racing,
                    PricePerDay = 2000,
                    Status = CarStatus.Available,
                    ImageUrl = "/images/cars/720s-gt3.jpg",
                    Description = "McLaren GT3 de competición con 720 CV. Aerodinámica y velocidad extremas.",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                
                // Drift Cars
                new Car
                {
                    Id = Guid.NewGuid(),
                    Brand = "Nissan",
                    Model = "Silvia S15 Spec-R",
                    Year = 2002,
                    Power = 420,
                    Type = CarType.Drift,
                    PricePerDay = 500,
                    Status = CarStatus.Available,
                    ImageUrl = "/images/cars/s15.jpg",
                    Description = "Nissan S15 preparado para drift con 420 CV. El clásico japonés por excelencia.",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Car
                {
                    Id = Guid.NewGuid(),
                    Brand = "Mazda",
                    Model = "RX-7 FD3S",
                    Year = 1999,
                    Power = 450,
                    Type = CarType.Drift,
                    PricePerDay = 550,
                    Status = CarStatus.Available,
                    ImageUrl = "/images/cars/rx7.jpg",
                    Description = "Mazda RX-7 con motor rotativo preparado. 450 CV de pura emoción drift.",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Car
                {
                    Id = Guid.NewGuid(),
                    Brand = "Toyota",
                    Model = "Supra MK4 A80",
                    Year = 1998,
                    Power = 550,
                    Type = CarType.Drift,
                    PricePerDay = 650,
                    Status = CarStatus.Available,
                    ImageUrl = "/images/cars/supra.jpg",
                    Description = "Toyota Supra legendario con 2JZ preparado. 550 CV de potencia drift.",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Car
                {
                    Id = Guid.NewGuid(),
                    Brand = "BMW",
                    Model = "E46 M3 Drift Spec",
                    Year = 2006,
                    Power = 380,
                    Type = CarType.Drift,
                    PricePerDay = 450,
                    Status = CarStatus.Available,
                    ImageUrl = "/images/cars/e46-drift.jpg",
                    Description = "BMW E46 M3 preparado para drift. 380 CV y equilibrio perfecto.",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                
                // Hybrid (Racing & Drift)
                new Car
                {
                    Id = Guid.NewGuid(),
                    Brand = "Nissan",
                    Model = "350Z Track Edition",
                    Year = 2008,
                    Power = 400,
                    Type = CarType.Hybrid,
                    PricePerDay = 480,
                    Status = CarStatus.Available,
                    ImageUrl = "/images/cars/350z.jpg",
                    Description = "Nissan 350Z polivalente. 400 CV para circuito y drift.",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Car
                {
                    Id = Guid.NewGuid(),
                    Brand = "Subaru",
                    Model = "WRX STI S209",
                    Year = 2021,
                    Power = 341,
                    Type = CarType.Hybrid,
                    PricePerDay = 520,
                    Status = CarStatus.Available,
                    ImageUrl = "/images/cars/wrx-sti.jpg",
                    Description = "Subaru WRX STI con tracción integral. Versátil para cualquier tipo de conducción.",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Car
                {
                    Id = Guid.NewGuid(),
                    Brand = "Ford",
                    Model = "Mustang GT Track Pack",
                    Year = 2023,
                    Power = 480,
                    Type = CarType.Hybrid,
                    PricePerDay = 600,
                    Status = CarStatus.Available,
                    ImageUrl = "/images/cars/mustang.jpg",
                    Description = "Ford Mustang GT americano con 480 CV V8. Músculo para circuito y drift.",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                
                // Some rented or in maintenance
                new Car
                {
                    Id = Guid.NewGuid(),
                    Brand = "Lamborghini",
                    Model = "Huracán Super Trofeo",
                    Year = 2022,
                    Power = 620,
                    Type = CarType.Racing,
                    PricePerDay = 2500,
                    Status = CarStatus.Rented,
                    ImageUrl = "/images/cars/huracan.jpg",
                    Description = "Lamborghini Huracán de competición. 620 CV de pura adrenalina italiana.",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new Car
                {
                    Id = Guid.NewGuid(),
                    Brand = "Nissan",
                    Model = "GT-R R34 V-Spec",
                    Year = 2002,
                    Power = 500,
                    Type = CarType.Hybrid,
                    PricePerDay = 900,
                    Status = CarStatus.Maintenance,
                    ImageUrl = "/images/cars/r34.jpg",
                    Description = "El legendario Skyline R34 preparado. 500 CV de leyenda japonesa.",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            };

            context.Cars.AddRange(cars);

            // Save all changes
            await context.SaveChangesAsync();

            Console.WriteLine("✅ Database seeded successfully!");
            Console.WriteLine($"   - {context.Users.Count()} users created");
            Console.WriteLine($"   - {context.Circuits.Count()} circuits created");
            Console.WriteLine($"   - {context.Cars.Count()} cars created");
            Console.WriteLine("\n📧 Admin credentials:");
            Console.WriteLine("   Email: admin@gt-turing.com");
            Console.WriteLine("   Password: Admin123!");
        }
    }
}
