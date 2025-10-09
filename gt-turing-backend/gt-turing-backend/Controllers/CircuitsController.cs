using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using gt_turing_backend.Data;
using gt_turing_backend.DTO;
using gt_turing_backend.Models;

namespace gt_turing_backend.Controllers
{
    /// <summary>
    /// Circuits Controller / Controlador de Circuitos
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class CircuitsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CircuitsController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Get all circuits with optional filters / Obtener todos los circuitos con filtros opcionales
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<CircuitDto>), 200)]
        public async Task<IActionResult> GetCircuits([FromQuery] CircuitFilterDto filter)
        {
            try
            {
                var query = _context.Circuits.AsQueryable();

                // Apply filters
                if (!string.IsNullOrEmpty(filter.Province))
                {
                    query = query.Where(c => c.Province.Contains(filter.Province));
                }

                if (!string.IsNullOrEmpty(filter.SurfaceType))
                {
                    if (Enum.TryParse<SurfaceType>(filter.SurfaceType, true, out var surfaceType))
                    {
                        query = query.Where(c => c.SurfaceType == surfaceType);
                    }
                }

                if (filter.MinLength.HasValue)
                {
                    query = query.Where(c => c.LengthMeters >= filter.MinLength.Value);
                }

                if (filter.MaxLength.HasValue)
                {
                    query = query.Where(c => c.LengthMeters <= filter.MaxLength.Value);
                }

                if (filter.IsAvailable.HasValue)
                {
                    query = query.Where(c => c.IsAvailable == filter.IsAvailable.Value);
                }

                // Pagination
                var totalCount = await query.CountAsync();
                var circuits = await query
                    .OrderBy(c => c.Province)
                    .ThenBy(c => c.Name)
                    .Skip((filter.PageNumber - 1) * filter.PageSize)
                    .Take(filter.PageSize)
                    .ToListAsync();

                var circuitDtos = circuits.Select(MapToDto).ToList();

                Response.Headers.Append("X-Total-Count", totalCount.ToString());
                Response.Headers.Append("X-Page-Number", filter.PageNumber.ToString());
                Response.Headers.Append("X-Page-Size", filter.PageSize.ToString());

                return Ok(circuitDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        /// <summary>
        /// Get circuit by ID / Obtener circuito por ID
        /// </summary>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(CircuitDto), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetCircuit(Guid id)
        {
            try
            {
                var circuit = await _context.Circuits.FindAsync(id);

                if (circuit == null)
                {
                    return NotFound(new { message = "Circuit not found" });
                }

                return Ok(MapToDto(circuit));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        /// <summary>
        /// Create new circuit / Crear nuevo circuito (Admin only)
        /// </summary>
        [HttpPost]
        [Authorize(Policy = "AdminOnly")]
        [ProducesResponseType(typeof(CircuitDto), 201)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> CreateCircuit([FromBody] CreateUpdateCircuitDto circuitDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                if (!Enum.TryParse<SurfaceType>(circuitDto.SurfaceType, true, out var surfaceType))
                {
                    return BadRequest(new { message = "Invalid surface type" });
                }

                var circuit = new Circuit
                {
                    Id = Guid.NewGuid(),
                    Name = circuitDto.Name,
                    Location = circuitDto.Location,
                    Province = circuitDto.Province,
                    LengthMeters = circuitDto.LengthMeters,
                    WidthMeters = circuitDto.WidthMeters,
                    SurfaceType = surfaceType,
                    ElevationChange = circuitDto.ElevationChange,
                    NumberOfCorners = circuitDto.NumberOfCorners,
                    IsAvailable = circuitDto.IsAvailable,
                    ImageUrl = circuitDto.ImageUrl,
                    Description = circuitDto.Description,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Circuits.Add(circuit);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetCircuit), new { id = circuit.Id }, MapToDto(circuit));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        /// <summary>
        /// Update circuit / Actualizar circuito (Admin only)
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Policy = "AdminOnly")]
        [ProducesResponseType(typeof(CircuitDto), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdateCircuit(Guid id, [FromBody] CreateUpdateCircuitDto circuitDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var circuit = await _context.Circuits.FindAsync(id);

                if (circuit == null)
                {
                    return NotFound(new { message = "Circuit not found" });
                }

                if (!Enum.TryParse<SurfaceType>(circuitDto.SurfaceType, true, out var surfaceType))
                {
                    return BadRequest(new { message = "Invalid surface type" });
                }

                circuit.Name = circuitDto.Name;
                circuit.Location = circuitDto.Location;
                circuit.Province = circuitDto.Province;
                circuit.LengthMeters = circuitDto.LengthMeters;
                circuit.WidthMeters = circuitDto.WidthMeters;
                circuit.SurfaceType = surfaceType;
                circuit.ElevationChange = circuitDto.ElevationChange;
                circuit.NumberOfCorners = circuitDto.NumberOfCorners;
                circuit.IsAvailable = circuitDto.IsAvailable;
                circuit.ImageUrl = circuitDto.ImageUrl;
                circuit.Description = circuitDto.Description;
                circuit.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(MapToDto(circuit));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete circuit / Eliminar circuito (Admin only)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminOnly")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        [ProducesResponseType(409)]
        public async Task<IActionResult> DeleteCircuit(Guid id)
        {
            try
            {
                var circuit = await _context.Circuits.Include(c => c.Reservations).FirstOrDefaultAsync(c => c.Id == id);

                if (circuit == null)
                {
                    return NotFound(new { message = "Circuit not found" });
                }

                // Check if circuit has active reservations
                if (circuit.Reservations.Any(r => r.Status == ReservationStatus.Confirmed || r.Status == ReservationStatus.Pending))
                {
                    return Conflict(new { message = "Cannot delete circuit with active reservations" });
                }

                _context.Circuits.Remove(circuit);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        private CircuitDto MapToDto(Circuit circuit)
        {
            return new CircuitDto
            {
                Id = circuit.Id,
                Name = circuit.Name,
                Location = circuit.Location,
                Province = circuit.Province,
                LengthMeters = circuit.LengthMeters,
                WidthMeters = circuit.WidthMeters,
                SurfaceType = circuit.SurfaceType.ToString(),
                ElevationChange = circuit.ElevationChange,
                NumberOfCorners = circuit.NumberOfCorners,
                IsAvailable = circuit.IsAvailable,
                ImageUrl = circuit.ImageUrl,
                Description = circuit.Description,
                CreatedAt = circuit.CreatedAt
            };
        }
    }
}
