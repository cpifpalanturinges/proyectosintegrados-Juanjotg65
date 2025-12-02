using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using gt_turing_backend.Data;
using gt_turing_backend.DTO;
using gt_turing_backend.Models;

namespace gt_turing_backend.Controllers
{
    /// <summary>
    /// Reservations Controller / Controlador de Reservas
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ReservationsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReservationsController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Get all reservations / Obtener todas las reservas
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<ReservationDto>), 200)]
        public async Task<IActionResult> GetReservations([FromQuery] ReservationFilterDto filter)
        {
            try
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
                var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

                if (userIdClaim == null)
                {
                    return Unauthorized();
                }

                var userId = Guid.Parse(userIdClaim.Value);
                var query = _context.Reservations
                    .Include(r => r.User)
                    .Include(r => r.Car)
                    .Include(r => r.Circuit)
                    .AsQueryable();

                // Non-admins can only see their own reservations
                if (userRole != "Admin" && !filter.UserId.HasValue)
                {
                    query = query.Where(r => r.UserId == userId);
                }
                else if (filter.UserId.HasValue && userRole == "Admin")
                {
                    query = query.Where(r => r.UserId == filter.UserId.Value);
                }

                // Apply additional filters
                if (filter.CarId.HasValue)
                {
                    query = query.Where(r => r.CarId == filter.CarId.Value);
                }

                if (filter.CircuitId.HasValue)
                {
                    query = query.Where(r => r.CircuitId == filter.CircuitId.Value);
                }

                if (!string.IsNullOrEmpty(filter.Status))
                {
                    if (Enum.TryParse<ReservationStatus>(filter.Status, true, out var status))
                    {
                        query = query.Where(r => r.Status == status);
                    }
                }

                if (filter.StartDate.HasValue)
                {
                    query = query.Where(r => r.StartDate >= filter.StartDate.Value);
                }

                if (filter.EndDate.HasValue)
                {
                    query = query.Where(r => r.EndDate <= filter.EndDate.Value);
                }

                // No server-side pagination: return the filtered list and let the frontend paginate client-side.
                var reservations = await query
                    .OrderByDescending(r => r.CreatedAt)
                    .ToListAsync();

                var reservationDtos = reservations.Select(MapToDto).ToList();

                return Ok(reservationDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        /// <summary>
        /// Get reservation by ID / Obtener reserva por ID
        /// </summary>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ReservationDto), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetReservation(Guid id)
        {
            try
            {
                var reservation = await _context.Reservations
                    .Include(r => r.User)
                    .Include(r => r.Car)
                    .Include(r => r.Circuit)
                    .FirstOrDefaultAsync(r => r.Id == id);

                if (reservation == null)
                {
                    return NotFound(new { message = "Reserva no encontrada" });
                }

                // Check authorization
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
                var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
                var userId = Guid.Parse(userIdClaim!.Value);

                if (userRole != "Admin" && reservation.UserId != userId)
                {
                    return Forbid();
                }

                return Ok(MapToDto(reservation));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        /// <summary>
        /// Create new reservation / Crear nueva reserva
        /// </summary>
        [HttpPost]
        [ProducesResponseType(typeof(ReservationDto), 201)]
        [ProducesResponseType(400)]
        [ProducesResponseType(409)]
        public async Task<IActionResult> CreateReservation([FromBody] CreateReservationDto reservationDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized();
                }

                var userId = Guid.Parse(userIdClaim.Value);

                // Validate dates
                if (reservationDto.StartDate >= reservationDto.EndDate)
                {
                    return BadRequest(new { message = "La fecha de fin debe ser posterior a la fecha de inicio" });
                }

                if (reservationDto.StartDate < DateTime.UtcNow.Date)
                {
                    return BadRequest(new { message = "La fecha de inicio no puede estar en el pasado" });
                }

                // Check if car exists and is available
                var car = await _context.Cars.FindAsync(reservationDto.CarId);
                if (car == null)
                {
                    return NotFound(new { message = "Coche no encontrado" });
                }

                if (car.Status != CarStatus.Available)
                {
                    return Conflict(new { message = "El coche no está disponible" });
                }

                // Check if circuit exists and is available
                var circuit = await _context.Circuits.FindAsync(reservationDto.CircuitId);
                if (circuit == null)
                {
                    return NotFound(new { message = "Circuito no encontrado" });
                }

                if (!circuit.IsAvailable)
                {
                    return Conflict(new { message = "El circuito no está disponible" });
                }

                // Business rule: Racing cars cannot be assigned to Concrete circuits
                if (car.Type == CarType.Racing && circuit.SurfaceType == SurfaceType.Concrete)
                {
                    return BadRequest(new { message = "Los coches de competición no pueden asignarse a circuitos de hormigón" });
                }

                // Check for overlapping reservations
                var hasOverlap = await _context.Reservations.AnyAsync(r =>
                    r.CarId == reservationDto.CarId &&
                    r.Status != ReservationStatus.Cancelled &&
                    r.Status != ReservationStatus.Completed &&
                    ((r.StartDate <= reservationDto.StartDate && r.EndDate >= reservationDto.StartDate) ||
                     (r.StartDate <= reservationDto.EndDate && r.EndDate >= reservationDto.EndDate) ||
                     (r.StartDate >= reservationDto.StartDate && r.EndDate <= reservationDto.EndDate))
                );

                if (hasOverlap)
                {
                    return Conflict(new { message = "El coche ya está reservado para las fechas seleccionadas" });
                }

                // Calculate total price
                var days = (reservationDto.EndDate - reservationDto.StartDate).Days + 1;
                var totalPrice = days * car.PricePerDay;

                var reservation = new Reservation
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    CarId = reservationDto.CarId,
                    CircuitId = reservationDto.CircuitId,
                    StartDate = reservationDto.StartDate,
                    EndDate = reservationDto.EndDate,
                    PickupTime = reservationDto.PickupTime,
                    ReturnTime = reservationDto.ReturnTime,
                    TotalPrice = totalPrice,
                    Status = ReservationStatus.Pending,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Reservations.Add(reservation);
                await _context.SaveChangesAsync();

                // Load navigation properties
                await _context.Entry(reservation).Reference(r => r.User).LoadAsync();
                await _context.Entry(reservation).Reference(r => r.Car).LoadAsync();
                await _context.Entry(reservation).Reference(r => r.Circuit).LoadAsync();

                return CreatedAtAction(nameof(GetReservation), new { id = reservation.Id }, MapToDto(reservation));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        /// <summary>
        /// Update reservation / Actualizar reserva
        /// </summary>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(ReservationDto), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdateReservation(Guid id, [FromBody] UpdateReservationDto reservationDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var reservation = await _context.Reservations
                    .Include(r => r.User)
                    .Include(r => r.Car)
                    .Include(r => r.Circuit)
                    .FirstOrDefaultAsync(r => r.Id == id);

                if (reservation == null)
                {
                    return NotFound(new { message = "Reserva no encontrada" });
                }

                // Check authorization
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
                var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
                var userId = Guid.Parse(userIdClaim!.Value);

                if (userRole != "Admin" && reservation.UserId != userId)
                {
                    return Forbid();
                }

                // Update fields
                if (reservationDto.StartDate.HasValue)
                {
                    reservation.StartDate = reservationDto.StartDate.Value;
                }

                if (reservationDto.EndDate.HasValue)
                {
                    reservation.EndDate = reservationDto.EndDate.Value;
                }

                if (reservationDto.PickupTime.HasValue)
                {
                    reservation.PickupTime = reservationDto.PickupTime.Value;
                }

                if (reservationDto.ReturnTime.HasValue)
                {
                    reservation.ReturnTime = reservationDto.ReturnTime.Value;
                }

                if (!string.IsNullOrEmpty(reservationDto.Status))
                {
                    if (Enum.TryParse<ReservationStatus>(reservationDto.Status, true, out var status))
                    {
                        // Only admins can change status to Confirmed or Completed
                        if ((status == ReservationStatus.Confirmed || status == ReservationStatus.Completed) && userRole != "Admin")
                        {
                            return Forbid();
                        }

                        reservation.Status = status;
                    }
                }

                // Recalculate price if dates changed
                if (reservationDto.StartDate.HasValue || reservationDto.EndDate.HasValue)
                {
                    var days = (reservation.EndDate - reservation.StartDate).Days + 1;
                    reservation.TotalPrice = days * reservation.Car.PricePerDay;
                }

                reservation.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(MapToDto(reservation));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete/Cancel reservation / Eliminar/Cancelar reserva
        /// </summary>
        [HttpDelete("{id}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> DeleteReservation(Guid id)
        {
            try
            {
                var reservation = await _context.Reservations.FindAsync(id);

                if (reservation == null)
                {
                    return NotFound(new { message = "Reserva no encontrada" });
                }

                // Check authorization
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
                var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
                var userId = Guid.Parse(userIdClaim!.Value);

                if (userRole != "Admin" && reservation.UserId != userId)
                {
                    return Forbid();
                }

                // Instead of deleting, mark as cancelled
                reservation.Status = ReservationStatus.Cancelled;
                reservation.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        /// <summary>
        /// Get occupied dates for a specific car / Obtener fechas ocupadas de un coche específico
        /// </summary>
        [HttpGet("car/{carId}/occupied-dates")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(IEnumerable<OccupiedDateDto>), 200)]
        public async Task<IActionResult> GetOccupiedDates(Guid carId)
        {
            try
            {
                var today = DateTime.UtcNow.Date;
                var futureLimit = today.AddMonths(6); // Solo próximos 6 meses

                var occupiedReservations = await _context.Reservations
                    .Where(r => r.CarId == carId 
                        && r.Status == ReservationStatus.Confirmed 
                        && r.EndDate >= today
                        && r.StartDate <= futureLimit)
                    .Select(r => new OccupiedDateDto
                    {
                        StartDate = r.StartDate,
                        EndDate = r.EndDate,
                        ReservationId = r.Id
                    })
                    .ToListAsync();

                return Ok(occupiedReservations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        private static ReservationDto MapToDto(Reservation reservation)
        {
            return new ReservationDto
            {
                Id = reservation.Id,
                UserId = reservation.UserId,
                CarId = reservation.CarId,
                CircuitId = reservation.CircuitId,
                StartDate = reservation.StartDate,
                EndDate = reservation.EndDate,
                PickupTime = reservation.PickupTime,
                ReturnTime = reservation.ReturnTime,
                TotalPrice = reservation.TotalPrice,
                Status = reservation.Status.ToString(),
                CreatedAt = reservation.CreatedAt,
                User = reservation.User != null ? new UserDto
                {
                    Id = reservation.User.Id,
                    Email = reservation.User.Email,
                    FirstName = reservation.User.FirstName,
                    LastName = reservation.User.LastName,
                    Phone = reservation.User.Phone,
                    Role = reservation.User.Role.ToString(),
                    IsBlocked = reservation.User.IsBlocked,
                    CreatedAt = reservation.User.CreatedAt
                } : null,
                Car = reservation.Car != null ? new CarDto
                {
                    Id = reservation.Car.Id,
                    Model = reservation.Car.Model,
                    Brand = reservation.Car.Brand,
                    Year = reservation.Car.Year,
                    Power = reservation.Car.Power,
                    Type = reservation.Car.Type.ToString(),
                    PricePerDay = reservation.Car.PricePerDay,
                    Status = reservation.Car.Status.ToString(),
                    ImageUrl = reservation.Car.ImageUrl,
                    Description = reservation.Car.Description,
                    CreatedAt = reservation.Car.CreatedAt
                } : null,
                Circuit = reservation.Circuit != null ? new CircuitDto
                {
                    Id = reservation.Circuit.Id,
                    Name = reservation.Circuit.Name,
                    Location = reservation.Circuit.Location,
                    Province = reservation.Circuit.Province,
                    LengthMeters = reservation.Circuit.LengthMeters,
                    WidthMeters = reservation.Circuit.WidthMeters,
                    SurfaceType = reservation.Circuit.SurfaceType.ToString(),
                    ElevationChange = reservation.Circuit.ElevationChange,
                    NumberOfCorners = reservation.Circuit.NumberOfCorners,
                    IsAvailable = reservation.Circuit.IsAvailable,
                    ImageUrl = reservation.Circuit.ImageUrl,
                    Description = reservation.Circuit.Description,
                    CreatedAt = reservation.Circuit.CreatedAt
                } : null
            };
        }
    }
}
