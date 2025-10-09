using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using gt_turing_backend.Data;
using gt_turing_backend.DTO;
using gt_turing_backend.Models;

namespace gt_turing_backend.Controllers
{
    /// <summary>
    /// Users Controller / Controlador de Usuarios (Admin only)
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Policy = "AdminOnly")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Get all users / Obtener todos los usuarios
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<UserDto>), 200)]
        public async Task<IActionResult> GetUsers([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 20)
        {
            try
            {
                var totalCount = await _context.Users.CountAsync();
                var users = await _context.Users
                    .OrderBy(u => u.Email)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var userDtos = users.Select(MapToDto).ToList();

                Response.Headers.Append("X-Total-Count", totalCount.ToString());
                Response.Headers.Append("X-Page-Number", pageNumber.ToString());
                Response.Headers.Append("X-Page-Size", pageSize.ToString());

                return Ok(userDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        /// <summary>
        /// Get user by ID / Obtener usuario por ID
        /// </summary>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(UserDto), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetUser(Guid id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);

                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                return Ok(MapToDto(user));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        /// <summary>
        /// Update user / Actualizar usuario
        /// </summary>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(UserDto), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserDto userDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var user = await _context.Users.FindAsync(id);

                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                user.FirstName = userDto.FirstName;
                user.LastName = userDto.LastName;
                user.Phone = userDto.Phone;
                user.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(MapToDto(user));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        /// <summary>
        /// Update user role / Actualizar rol de usuario
        /// </summary>
        [HttpPatch("{id}/role")]
        [ProducesResponseType(typeof(UserDto), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdateUserRole(Guid id, [FromBody] UpdateUserRoleDto roleDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var user = await _context.Users.FindAsync(id);

                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                if (!Enum.TryParse<UserRole>(roleDto.Role, true, out var userRole))
                {
                    return BadRequest(new { message = "Invalid role" });
                }

                user.Role = userRole;
                user.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(MapToDto(user));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        /// <summary>
        /// Block/Unblock user / Bloquear/Desbloquear usuario
        /// </summary>
        [HttpPatch("{id}/block")]
        [ProducesResponseType(typeof(UserDto), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> ToggleBlockUser(Guid id, [FromBody] BlockUserDto blockDto)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);

                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                // Prevent blocking self
                var currentUserIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
                if (currentUserIdClaim != null && Guid.Parse(currentUserIdClaim.Value) == id)
                {
                    return BadRequest(new { message = "Cannot block yourself" });
                }

                user.IsBlocked = blockDto.IsBlocked;
                user.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(MapToDto(user));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete user / Eliminar usuario
        /// </summary>
        [HttpDelete("{id}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        [ProducesResponseType(409)]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.Reservations)
                    .Include(u => u.Conversations)
                    .FirstOrDefaultAsync(u => u.Id == id);

                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                // Prevent deleting self
                var currentUserIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
                if (currentUserIdClaim != null && Guid.Parse(currentUserIdClaim.Value) == id)
                {
                    return BadRequest(new { message = "Cannot delete yourself" });
                }

                // Check if user has active reservations
                if (user.Reservations.Any(r => r.Status == ReservationStatus.Confirmed || r.Status == ReservationStatus.Pending))
                {
                    return Conflict(new { message = "Cannot delete user with active reservations" });
                }

                _context.Users.Remove(user);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        /// <summary>
        /// Get user statistics / Obtener estadísticas de usuario
        /// </summary>
        [HttpGet("{id}/stats")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetUserStats(Guid id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);

                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                var totalReservations = await _context.Reservations.CountAsync(r => r.UserId == id);
                var activeReservations = await _context.Reservations.CountAsync(r => r.UserId == id && (r.Status == ReservationStatus.Confirmed || r.Status == ReservationStatus.Pending));
                var completedReservations = await _context.Reservations.CountAsync(r => r.UserId == id && r.Status == ReservationStatus.Completed);
                var totalSpent = await _context.Reservations.Where(r => r.UserId == id && r.Status == ReservationStatus.Completed).SumAsync(r => (decimal?)r.TotalPrice) ?? 0;

                var stats = new
                {
                    userId = id,
                    totalReservations,
                    activeReservations,
                    completedReservations,
                    cancelledReservations = totalReservations - activeReservations - completedReservations,
                    totalSpent,
                    memberSince = user.CreatedAt
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        private UserDto MapToDto(User user)
        {
            return new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Phone = user.Phone,
                Role = user.Role.ToString(),
                IsBlocked = user.IsBlocked,
                CreatedAt = user.CreatedAt
            };
        }
    }

    public class UpdateUserRoleDto
    {
        public string Role { get; set; } = string.Empty;
    }

    public class BlockUserDto
    {
        public bool IsBlocked { get; set; }
    }
}
