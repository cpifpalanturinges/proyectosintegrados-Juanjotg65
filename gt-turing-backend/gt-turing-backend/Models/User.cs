using System.ComponentModel.DataAnnotations;

namespace gt_turing_backend.Models
{
    /// <summary>
    /// User roles enum / Enumeración de roles de usuario
    /// </summary>
    public enum UserRole
    {
        Visitor,
        User,
        Admin
    }

    /// <summary>
    /// User entity / Entidad de usuario
    /// </summary>
    public class User
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [EmailAddress]
        [MaxLength(255)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string LastName { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? Phone { get; set; }

        [Required]
        public UserRole Role { get; set; } = UserRole.Visitor;

        public bool IsBlocked { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
        public ICollection<Conversation> Conversations { get; set; } = new List<Conversation>();
        public ICollection<Message> Messages { get; set; } = new List<Message>();
    }
}
