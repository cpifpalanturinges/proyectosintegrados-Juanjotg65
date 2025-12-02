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
                    ImageUrl = "/images/barcelona.jpg",
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
                    ImageUrl = "/images/jarama.jpg",
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
                    ImageUrl = "/images/jerez.jpg",
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
                    SurfaceType = SurfaceType.Mixed,
                    ElevationChange = 45,
                    NumberOfCorners = 17,
                    IsAvailable = true,
                    ImageUrl = "/images/motorland.jpg",
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
                    SurfaceType = SurfaceType.Mixed,
                    ElevationChange = 52,
                    NumberOfCorners = 15,
                    IsAvailable = true,
                    ImageUrl = "/images/navarra.jpg",
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
                    ImageUrl = "/images/cheste.jpg",
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
                    SurfaceType = SurfaceType.Mixed,
                    ElevationChange = 60,
                    NumberOfCorners = 16,
                    IsAvailable = true,
                    ImageUrl = "/images/castelloli.jpg",
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
                    SurfaceType = SurfaceType.Concrete,
                    ElevationChange = 10,
                    NumberOfCorners = 6,
                    IsAvailable = false,
                    ImageUrl = "/images/sitges.jpg",
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
                    ImageUrl = "/images/coche1.jpg",
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
                    ImageUrl = "/images/coche2.jpg",
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
                    ImageUrl = "/images/coche3.jpg",
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
                    ImageUrl = "/images/coche4.jpg",
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
                    ImageUrl = "/images/coche5.jpg",
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
                    ImageUrl = "/images/coche6.jpg",
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
                    ImageUrl = "/images/coche7.jpg",
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
                    ImageUrl = "/images/coche8.jpg",
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
                    ImageUrl = "/images/coche9.jpg",
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
                    ImageUrl = "/images/coche10.jpg",
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
                    ImageUrl = "/images/coche11.jpg",
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
                    ImageUrl = "/images/coche12.jpg",
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
                    ImageUrl = "/images/coche13.jpg",
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
                    ImageUrl = "/images/coche14.jpg",
                    Description = "El legendario Skyline R34 preparado. 500 CV de leyenda japonesa.",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            };

            context.Cars.AddRange(cars);

            // Save cars and circuits first to get their IDs
            await context.SaveChangesAsync();

            // Seed Sample Reservations
            var reservations = new List<Reservation>();
            var random = new Random();
            var today = DateTime.UtcNow.Date;

            // Create reservations for different cars at different dates
            // Nissan GT-R R35 Nismo - 3 reservations
            reservations.Add(new Reservation
            {
                Id = Guid.NewGuid(),
                UserId = testUser1.Id,
                CarId = cars[0].Id, // GT-R R35
                CircuitId = circuits[0].Id, // Barcelona
                StartDate = today.AddDays(5),
                EndDate = today.AddDays(7),
                TotalPrice = cars[0].PricePerDay * 2,
                Status = ReservationStatus.Confirmed,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });

            reservations.Add(new Reservation
            {
                Id = Guid.NewGuid(),
                UserId = testUser2.Id,
                CarId = cars[0].Id,
                CircuitId = circuits[1].Id, // Jarama
                StartDate = today.AddDays(15),
                EndDate = today.AddDays(17),
                TotalPrice = cars[0].PricePerDay * 2,
                Status = ReservationStatus.Confirmed,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });

            reservations.Add(new Reservation
            {
                Id = Guid.NewGuid(),
                UserId = testUser1.Id,
                CarId = cars[0].Id,
                CircuitId = circuits[2].Id, // Jerez
                StartDate = today.AddDays(25),
                EndDate = today.AddDays(26),
                TotalPrice = cars[0].PricePerDay,
                Status = ReservationStatus.Confirmed,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });

            // Porsche 911 GT3 RS - 4 reservations
            reservations.Add(new Reservation
            {
                Id = Guid.NewGuid(),
                UserId = testUser2.Id,
                CarId = cars[1].Id, // Porsche 911
                CircuitId = circuits[0].Id,
                StartDate = today.AddDays(3),
                EndDate = today.AddDays(5),
                TotalPrice = cars[1].PricePerDay * 2,
                Status = ReservationStatus.Confirmed,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });

            reservations.Add(new Reservation
            {
                Id = Guid.NewGuid(),
                UserId = testUser1.Id,
                CarId = cars[1].Id,
                CircuitId = circuits[3].Id, // Motorland
                StartDate = today.AddDays(10),
                EndDate = today.AddDays(12),
                TotalPrice = cars[1].PricePerDay * 2,
                Status = ReservationStatus.Confirmed,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });

            reservations.Add(new Reservation
            {
                Id = Guid.NewGuid(),
                UserId = testUser2.Id,
                CarId = cars[1].Id,
                CircuitId = circuits[5].Id, // Cheste
                StartDate = today.AddDays(20),
                EndDate = today.AddDays(21),
                TotalPrice = cars[1].PricePerDay,
                Status = ReservationStatus.Confirmed,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });

            reservations.Add(new Reservation
            {
                Id = Guid.NewGuid(),
                UserId = testUser1.Id,
                CarId = cars[1].Id,
                CircuitId = circuits[4].Id, // Navarra
                StartDate = today.AddDays(28),
                EndDate = today.AddDays(30),
                TotalPrice = cars[1].PricePerDay * 2,
                Status = ReservationStatus.Confirmed,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });

            // BMW M4 Competition - 2 reservations
            reservations.Add(new Reservation
            {
                Id = Guid.NewGuid(),
                UserId = testUser1.Id,
                CarId = cars[2].Id, // BMW M4
                CircuitId = circuits[1].Id,
                StartDate = today.AddDays(8),
                EndDate = today.AddDays(10),
                TotalPrice = cars[2].PricePerDay * 2,
                Status = ReservationStatus.Confirmed,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });

            reservations.Add(new Reservation
            {
                Id = Guid.NewGuid(),
                UserId = testUser2.Id,
                CarId = cars[2].Id,
                CircuitId = circuits[6].Id, // Castellolí
                StartDate = today.AddDays(18),
                EndDate = today.AddDays(19),
                TotalPrice = cars[2].PricePerDay,
                Status = ReservationStatus.Confirmed,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });

            // Ferrari 488 Challenge - 3 reservations
            reservations.Add(new Reservation
            {
                Id = Guid.NewGuid(),
                UserId = testUser2.Id,
                CarId = cars[3].Id, // Ferrari
                CircuitId = circuits[0].Id,
                StartDate = today.AddDays(2),
                EndDate = today.AddDays(3),
                TotalPrice = cars[3].PricePerDay,
                Status = ReservationStatus.Confirmed,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });

            reservations.Add(new Reservation
            {
                Id = Guid.NewGuid(),
                UserId = testUser1.Id,
                CarId = cars[3].Id,
                CircuitId = circuits[2].Id,
                StartDate = today.AddDays(12),
                EndDate = today.AddDays(14),
                TotalPrice = cars[3].PricePerDay * 2,
                Status = ReservationStatus.Confirmed,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });

            reservations.Add(new Reservation
            {
                Id = Guid.NewGuid(),
                UserId = testUser2.Id,
                CarId = cars[3].Id,
                CircuitId = circuits[3].Id,
                StartDate = today.AddDays(22),
                EndDate = today.AddDays(24),
                TotalPrice = cars[3].PricePerDay * 2,
                Status = ReservationStatus.Confirmed,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });

            // McLaren 720S GT3 - 2 reservations
            reservations.Add(new Reservation
            {
                Id = Guid.NewGuid(),
                UserId = testUser1.Id,
                CarId = cars[4].Id, // McLaren
                CircuitId = circuits[0].Id,
                StartDate = today.AddDays(6),
                EndDate = today.AddDays(8),
                TotalPrice = cars[4].PricePerDay * 2,
                Status = ReservationStatus.Confirmed,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });

            reservations.Add(new Reservation
            {
                Id = Guid.NewGuid(),
                UserId = testUser2.Id,
                CarId = cars[4].Id,
                CircuitId = circuits[5].Id,
                StartDate = today.AddDays(16),
                EndDate = today.AddDays(18),
                TotalPrice = cars[4].PricePerDay * 2,
                Status = ReservationStatus.Confirmed,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });

            // Nissan Silvia S15 - 2 reservations (Drift car)
            reservations.Add(new Reservation
            {
                Id = Guid.NewGuid(),
                UserId = testUser1.Id,
                CarId = cars[5].Id, // Silvia
                CircuitId = circuits[6].Id,
                StartDate = today.AddDays(4),
                EndDate = today.AddDays(5),
                TotalPrice = cars[5].PricePerDay,
                Status = ReservationStatus.Confirmed,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });

            reservations.Add(new Reservation
            {
                Id = Guid.NewGuid(),
                UserId = testUser2.Id,
                CarId = cars[5].Id,
                CircuitId = circuits[4].Id,
                StartDate = today.AddDays(14),
                EndDate = today.AddDays(15),
                TotalPrice = cars[5].PricePerDay,
                Status = ReservationStatus.Confirmed,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });

            // Toyota Supra - 3 reservations (Popular drift car)
            reservations.Add(new Reservation
            {
                Id = Guid.NewGuid(),
                UserId = testUser1.Id,
                CarId = cars[7].Id, // Supra
                CircuitId = circuits[6].Id,
                StartDate = today.AddDays(1),
                EndDate = today.AddDays(2),
                TotalPrice = cars[7].PricePerDay,
                Status = ReservationStatus.Confirmed,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });

            reservations.Add(new Reservation
            {
                Id = Guid.NewGuid(),
                UserId = testUser2.Id,
                CarId = cars[7].Id,
                CircuitId = circuits[4].Id,
                StartDate = today.AddDays(11),
                EndDate = today.AddDays(13),
                TotalPrice = cars[7].PricePerDay * 2,
                Status = ReservationStatus.Confirmed,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });

            reservations.Add(new Reservation
            {
                Id = Guid.NewGuid(),
                UserId = testUser1.Id,
                CarId = cars[7].Id,
                CircuitId = circuits[1].Id,
                StartDate = today.AddDays(27),
                EndDate = today.AddDays(29),
                TotalPrice = cars[7].PricePerDay * 2,
                Status = ReservationStatus.Confirmed,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });

            // ========== RESERVAS COMPLETADAS (PASADAS) ==========
            // Estas son reservas que ya se realizaron en el pasado
            
            // Completada hace 1 mes - Porsche 911
            reservations.Add(new Reservation
            {
                Id = Guid.NewGuid(),
                UserId = testUser1.Id,
                CarId = cars[1].Id, // Porsche 911
                CircuitId = circuits[0].Id, // Barcelona
                StartDate = today.AddDays(-30),
                EndDate = today.AddDays(-28),
                PickupTime = new TimeSpan(9, 0, 0),
                ReturnTime = new TimeSpan(18, 0, 0),
                TotalPrice = cars[1].PricePerDay * 2,
                Status = ReservationStatus.Completed,
                CreatedAt = DateTime.UtcNow.AddDays(-35),
                UpdatedAt = DateTime.UtcNow.AddDays(-28)
            });

            // Completada hace 3 semanas - Ferrari
            reservations.Add(new Reservation
            {
                Id = Guid.NewGuid(),
                UserId = testUser1.Id,
                CarId = cars[3].Id, // Ferrari
                CircuitId = circuits[2].Id, // Jerez
                StartDate = today.AddDays(-21),
                EndDate = today.AddDays(-20),
                PickupTime = new TimeSpan(10, 0, 0),
                ReturnTime = new TimeSpan(17, 0, 0),
                TotalPrice = cars[3].PricePerDay,
                Status = ReservationStatus.Completed,
                CreatedAt = DateTime.UtcNow.AddDays(-25),
                UpdatedAt = DateTime.UtcNow.AddDays(-20)
            });

            // Completada hace 2 semanas - GT-R
            reservations.Add(new Reservation
            {
                Id = Guid.NewGuid(),
                UserId = testUser1.Id,
                CarId = cars[0].Id, // GT-R
                CircuitId = circuits[3].Id, // Motorland
                StartDate = today.AddDays(-14),
                EndDate = today.AddDays(-12),
                PickupTime = new TimeSpan(8, 30, 0),
                ReturnTime = new TimeSpan(19, 0, 0),
                TotalPrice = cars[0].PricePerDay * 2,
                Status = ReservationStatus.Completed,
                CreatedAt = DateTime.UtcNow.AddDays(-20),
                UpdatedAt = DateTime.UtcNow.AddDays(-12)
            });

            // Completada hace 10 días - McLaren
            reservations.Add(new Reservation
            {
                Id = Guid.NewGuid(),
                UserId = testUser1.Id,
                CarId = cars[4].Id, // McLaren
                CircuitId = circuits[0].Id, // Barcelona
                StartDate = today.AddDays(-10),
                EndDate = today.AddDays(-9),
                PickupTime = new TimeSpan(9, 0, 0),
                ReturnTime = new TimeSpan(18, 30, 0),
                TotalPrice = cars[4].PricePerDay,
                Status = ReservationStatus.Completed,
                CreatedAt = DateTime.UtcNow.AddDays(-15),
                UpdatedAt = DateTime.UtcNow.AddDays(-9)
            });

            // Completada hace 5 días - BMW M4
            reservations.Add(new Reservation
            {
                Id = Guid.NewGuid(),
                UserId = testUser1.Id,
                CarId = cars[2].Id, // BMW M4
                CircuitId = circuits[5].Id, // Cheste
                StartDate = today.AddDays(-5),
                EndDate = today.AddDays(-4),
                PickupTime = new TimeSpan(10, 0, 0),
                ReturnTime = new TimeSpan(17, 30, 0),
                TotalPrice = cars[2].PricePerDay,
                Status = ReservationStatus.Completed,
                CreatedAt = DateTime.UtcNow.AddDays(-10),
                UpdatedAt = DateTime.UtcNow.AddDays(-4)
            });

            // Completada hace 2 meses - Supra (para testUser2 también)
            reservations.Add(new Reservation
            {
                Id = Guid.NewGuid(),
                UserId = testUser2.Id,
                CarId = cars[7].Id, // Supra
                CircuitId = circuits[4].Id, // Navarra
                StartDate = today.AddDays(-60),
                EndDate = today.AddDays(-58),
                PickupTime = new TimeSpan(9, 30, 0),
                ReturnTime = new TimeSpan(18, 0, 0),
                TotalPrice = cars[7].PricePerDay * 2,
                Status = ReservationStatus.Completed,
                CreatedAt = DateTime.UtcNow.AddDays(-65),
                UpdatedAt = DateTime.UtcNow.AddDays(-58)
            });

            context.Reservations.AddRange(reservations);

            // Save all changes
            await context.SaveChangesAsync();

            Console.WriteLine("✅ Database seeded successfully!");
            Console.WriteLine($"   - {context.Users.Count()} users created");
            Console.WriteLine($"   - {context.Circuits.Count()} circuits created");
            Console.WriteLine($"   - {context.Cars.Count()} cars created");
            Console.WriteLine($"   - {context.Reservations.Count()} reservations created");
            Console.WriteLine("\n📧 Admin credentials:");
            Console.WriteLine("   Email: admin@gt-turing.com");
            Console.WriteLine("   Password: Admin123!");
        }
    }
}
