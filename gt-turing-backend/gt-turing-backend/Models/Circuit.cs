using System.ComponentModel.DataAnnotations;

namespace gt_turing_backend.Models
{
    /// <summary>
    /// Circuit surface type enum / Enumeración de tipo de superficie
    /// </summary>
    public enum SurfaceType
    {
        Asphalt,
        Concrete,
        Mixed
    }

    /// <summary>
    /// Circuit entity / Entidad de circuito
    /// </summary>
    public class Circuit
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string Location { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Province { get; set; } = string.Empty;

        [Required]
        [Range(500, 10000)]
        public int LengthMeters { get; set; }

        [Required]
        [Range(5, 50)]
        public decimal WidthMeters { get; set; }

        [Required]
        public SurfaceType SurfaceType { get; set; }

        [Range(0, 500)]
        public int? ElevationChange { get; set; }

        [Range(1, 50)]
        public int? NumberOfCorners { get; set; }

        public bool IsAvailable { get; set; } = true;

        [MaxLength(500)]
        public string? ImageUrl { get; set; }

        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    }
}
