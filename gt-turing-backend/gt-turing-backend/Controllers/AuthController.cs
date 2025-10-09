using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using gt_turing_backend.DTO;
using gt_turing_backend.Services;

namespace gt_turing_backend.Controllers
{
    /// <summary>
    /// Authentication Controller / Controlador de Autenticación
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        /// <summary>
        /// User login / Inicio de sesión
        /// </summary>
        [HttpPost("login")]
        [ProducesResponseType(typeof(AuthResponseDto), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var response = await _authService.LoginAsync(loginDto);

                if (response == null)
                {
                    return Unauthorized(new { message = "Invalid email or password" });
                }

                return Ok(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred during login", error = ex.Message });
            }
        }

        /// <summary>
        /// User registration / Registro de usuario
        /// </summary>
        [HttpPost("register")]
        [ProducesResponseType(typeof(AuthResponseDto), 201)]
        [ProducesResponseType(400)]
        [ProducesResponseType(409)]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto registerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var response = await _authService.RegisterAsync(registerDto);

                if (response == null)
                {
                    return Conflict(new { message = "User with this email already exists" });
                }

                return CreatedAtAction(nameof(Login), new { email = registerDto.Email }, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred during registration", error = ex.Message });
            }
        }

        /// <summary>
        /// Get current user / Obtener usuario actual
        /// </summary>
        [HttpGet("me")]
        [Authorize]
        [ProducesResponseType(typeof(UserDto), 200)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetCurrentUser()
        {
            try
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized(new { message = "User ID not found in token" });
                }

                var userId = Guid.Parse(userIdClaim.Value);
                var user = await _authService.GetUserByIdAsync(userId);

                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                var userDto = new UserDto
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

                return Ok(userDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        /// <summary>
        /// Refresh token / Refrescar token
        /// </summary>
        [HttpPost("refresh")]
        [Authorize]
        [ProducesResponseType(typeof(AuthResponseDto), 200)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> RefreshToken()
        {
            try
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized(new { message = "User ID not found in token" });
                }

                var userId = Guid.Parse(userIdClaim.Value);
                var user = await _authService.GetUserByIdAsync(userId);

                if (user == null || user.IsBlocked)
                {
                    return Unauthorized(new { message = "User not found or blocked" });
                }

                var loginDto = new LoginRequestDto
                {
                    Email = user.Email,
                    Password = "" // Not used for refresh
                };

                // Generate new token
                var token = new JwtService(HttpContext.RequestServices.GetRequiredService<IConfiguration>()).GenerateToken(user);

                var response = new AuthResponseDto
                {
                    Token = token,
                    Expiration = DateTime.UtcNow.AddHours(24),
                    User = new UserDto
                    {
                        Id = user.Id,
                        Email = user.Email,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Phone = user.Phone,
                        Role = user.Role.ToString(),
                        IsBlocked = user.IsBlocked,
                        CreatedAt = user.CreatedAt
                    }
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }
    }
}
