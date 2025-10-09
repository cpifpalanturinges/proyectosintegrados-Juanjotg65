using System.ComponentModel.DataAnnotations;

namespace gt_turing_backend.Models
{
    /// <summary>
    /// Car type enum / Enumeración de tipo de coche
    /// </summary>
    public enum CarType
    {
        Racing,
        Drift,
        Hybrid
    }

    /// <summary>
    /// Car status enum / Enumeración de estado de coche
    /// </summary>
    public enum CarStatus
    {
        Available,
        Rented,
        Maintenance
    }

    /// <summary>
    /// Car entity / Entidad de coche
    /// </summary>
    public class Car
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Model { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Brand { get; set; } = string.Empty;

        [Required]
        [Range(1900, 2100)]
        public int Year { get; set; }

        [Required]
        [Range(50, 2000)]
        public int Power { get; set; }

        [Required]
        public CarType Type { get; set; }

        [Required]
        [Range(0, 100000)]
        public decimal PricePerDay { get; set; }

        [Required]
        public CarStatus Status { get; set; } = CarStatus.Available;

        [MaxLength(500)]
        public string? ImageUrl { get; set; }

        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    }
}
