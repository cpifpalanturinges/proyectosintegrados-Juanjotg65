using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace gt_turing_backend.Models
{
    /// <summary>
    /// Reservation status enum / Enumeración de estado de reserva
    /// </summary>
    public enum ReservationStatus
    {
        Pending,
        Confirmed,
        Cancelled,
        Completed
    }

    /// <summary>
    /// Reservation entity / Entidad de reserva
    /// </summary>
    public class Reservation
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid UserId { get; set; }

        [Required]
        public Guid CarId { get; set; }

        [Required]
        public Guid CircuitId { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        public TimeSpan PickupTime { get; set; }

        [Required]
        public TimeSpan ReturnTime { get; set; }

        [Required]
        [Range(0, 1000000)]
        public decimal TotalPrice { get; set; }

        [Required]
        public ReservationStatus Status { get; set; } = ReservationStatus.Pending;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("UserId")]
        public User User { get; set; } = null!;

        [ForeignKey("CarId")]
        public Car Car { get; set; } = null!;

        [ForeignKey("CircuitId")]
        public Circuit Circuit { get; set; } = null!;
    }
}
