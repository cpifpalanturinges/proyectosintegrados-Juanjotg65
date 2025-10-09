using Microsoft.EntityFrameworkCore;
using gt_turing_backend.Data;
using gt_turing_backend.Models;
using gt_turing_backend.DTO;
using BCrypt.Net;

namespace gt_turing_backend.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto?> LoginAsync(LoginRequestDto loginDto);
        Task<AuthResponseDto?> RegisterAsync(RegisterRequestDto registerDto);
        Task<User?> GetUserByIdAsync(Guid userId);
        Task<User?> GetUserByEmailAsync(string email);
    }

    /// <summary>
    /// Authentication Service
    /// Servicio de Autenticación
    /// </summary>
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IJwtService _jwtService;

        public AuthService(AppDbContext context, IJwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        /// <summary>
        /// User login / Inicio de sesión de usuario
        /// </summary>
        public async Task<AuthResponseDto?> LoginAsync(LoginRequestDto loginDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
            {
                return null;
            }

            if (user.IsBlocked)
            {
                throw new UnauthorizedAccessException("User account is blocked");
            }

            var token = _jwtService.GenerateToken(user);

            return new AuthResponseDto
            {
                Token = token,
                Expiration = DateTime.UtcNow.AddHours(24),
                User = MapToUserDto(user)
            };
        }

        /// <summary>
        /// User registration / Registro de usuario
        /// </summary>
        public async Task<AuthResponseDto?> RegisterAsync(RegisterRequestDto registerDto)
        {
            // Check if user already exists
            if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
            {
                return null;
            }

            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = registerDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                Phone = registerDto.Phone,
                Role = UserRole.User,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = _jwtService.GenerateToken(user);

            return new AuthResponseDto
            {
                Token = token,
                Expiration = DateTime.UtcNow.AddHours(24),
                User = MapToUserDto(user)
            };
        }

        public async Task<User?> GetUserByIdAsync(Guid userId)
        {
            return await _context.Users.FindAsync(userId);
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        private UserDto MapToUserDto(User user)
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
}
