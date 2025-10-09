using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using gt_turing_backend.Data;
using gt_turing_backend.DTO;
using gt_turing_backend.Models;

namespace gt_turing_backend.Controllers
{
    /// <summary>
    /// Cars Controller / Controlador de Coches
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class CarsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CarsController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Get all cars with optional filters / Obtener todos los coches con filtros opcionales
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<CarDto>), 200)]
        public async Task<IActionResult> GetCars([FromQuery] CarFilterDto filter)
        {
            try
            {
                var query = _context.Cars.AsQueryable();

                // Apply filters
                if (!string.IsNullOrEmpty(filter.Type))
                {
                    if (Enum.TryParse<CarType>(filter.Type, true, out var carType))
                    {
                        query = query.Where(c => c.Type == carType);
                    }
                }

                if (!string.IsNullOrEmpty(filter.Status))
                {
                    if (Enum.TryParse<CarStatus>(filter.Status, true, out var carStatus))
                    {
                        query = query.Where(c => c.Status == carStatus);
                    }
                }

                if (filter.MinPower.HasValue)
                {
                    query = query.Where(c => c.Power >= filter.MinPower.Value);
                }

                if (filter.MaxPower.HasValue)
                {
                    query = query.Where(c => c.Power <= filter.MaxPower.Value);
                }

                if (filter.MaxPrice.HasValue)
                {
                    query = query.Where(c => c.PricePerDay <= filter.MaxPrice.Value);
                }

                if (!string.IsNullOrEmpty(filter.Brand))
                {
                    query = query.Where(c => c.Brand.Contains(filter.Brand));
                }

                // Pagination
                var totalCount = await query.CountAsync();
                var cars = await query
                    .OrderBy(c => c.Brand)
                    .ThenBy(c => c.Model)
                    .Skip((filter.PageNumber - 1) * filter.PageSize)
                    .Take(filter.PageSize)
                    .ToListAsync();

                var carDtos = cars.Select(MapToDto).ToList();

                Response.Headers.Append("X-Total-Count", totalCount.ToString());
                Response.Headers.Append("X-Page-Number", filter.PageNumber.ToString());
                Response.Headers.Append("X-Page-Size", filter.PageSize.ToString());

                return Ok(carDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        /// <summary>
        /// Get car by ID / Obtener coche por ID
        /// </summary>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(CarDto), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetCar(Guid id)
        {
            try
            {
                var car = await _context.Cars.FindAsync(id);

                if (car == null)
                {
                    return NotFound(new { message = "Car not found" });
                }

                return Ok(MapToDto(car));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        /// <summary>
        /// Create new car / Crear nuevo coche (Admin only)
        /// </summary>
        [HttpPost]
        [Authorize(Policy = "AdminOnly")]
        [ProducesResponseType(typeof(CarDto), 201)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        [ProducesResponseType(403)]
        public async Task<IActionResult> CreateCar([FromBody] CreateUpdateCarDto carDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                if (!Enum.TryParse<CarType>(carDto.Type, true, out var carType))
                {
                    return BadRequest(new { message = "Invalid car type" });
                }

                if (!Enum.TryParse<CarStatus>(carDto.Status, true, out var carStatus))
                {
                    return BadRequest(new { message = "Invalid car status" });
                }

                var car = new Car
                {
                    Id = Guid.NewGuid(),
                    Model = carDto.Model,
                    Brand = carDto.Brand,
                    Year = carDto.Year,
                    Power = carDto.Power,
                    Type = carType,
                    PricePerDay = carDto.PricePerDay,
                    Status = carStatus,
                    ImageUrl = carDto.ImageUrl,
                    Description = carDto.Description,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Cars.Add(car);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetCar), new { id = car.Id }, MapToDto(car));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        /// <summary>
        /// Update car / Actualizar coche (Admin only)
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Policy = "AdminOnly")]
        [ProducesResponseType(typeof(CarDto), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdateCar(Guid id, [FromBody] CreateUpdateCarDto carDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var car = await _context.Cars.FindAsync(id);

                if (car == null)
                {
                    return NotFound(new { message = "Car not found" });
                }

                if (!Enum.TryParse<CarType>(carDto.Type, true, out var carType))
                {
                    return BadRequest(new { message = "Invalid car type" });
                }

                if (!Enum.TryParse<CarStatus>(carDto.Status, true, out var carStatus))
                {
                    return BadRequest(new { message = "Invalid car status" });
                }

                car.Model = carDto.Model;
                car.Brand = carDto.Brand;
                car.Year = carDto.Year;
                car.Power = carDto.Power;
                car.Type = carType;
                car.PricePerDay = carDto.PricePerDay;
                car.Status = carStatus;
                car.ImageUrl = carDto.ImageUrl;
                car.Description = carDto.Description;
                car.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(MapToDto(car));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete car / Eliminar coche (Admin only)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminOnly")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        [ProducesResponseType(409)]
        public async Task<IActionResult> DeleteCar(Guid id)
        {
            try
            {
                var car = await _context.Cars.Include(c => c.Reservations).FirstOrDefaultAsync(c => c.Id == id);

                if (car == null)
                {
                    return NotFound(new { message = "Car not found" });
                }

                // Check if car has active reservations
                if (car.Reservations.Any(r => r.Status == ReservationStatus.Confirmed || r.Status == ReservationStatus.Pending))
                {
                    return Conflict(new { message = "Cannot delete car with active reservations" });
                }

                _context.Cars.Remove(car);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        private CarDto MapToDto(Car car)
        {
            return new CarDto
            {
                Id = car.Id,
                Model = car.Model,
                Brand = car.Brand,
                Year = car.Year,
                Power = car.Power,
                Type = car.Type.ToString(),
                PricePerDay = car.PricePerDay,
                Status = car.Status.ToString(),
                ImageUrl = car.ImageUrl,
                Description = car.Description,
                CreatedAt = car.CreatedAt
            };
        }
    }
}
