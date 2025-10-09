using System.ComponentModel.DataAnnotations;

namespace gt_turing_backend.DTO
{
    /// <summary>
    /// Reservation DTO for responses
    /// </summary>
    public class ReservationDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid CarId { get; set; }
        public Guid CircuitId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public TimeSpan PickupTime { get; set; }
        public TimeSpan ReturnTime { get; set; }
        public decimal TotalPrice { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        
        // Related entities
        public UserDto? User { get; set; }
        public CarDto? Car { get; set; }
        public CircuitDto? Circuit { get; set; }
    }

    /// <summary>
    /// Create reservation DTO
    /// </summary>
    public class CreateReservationDto
    {
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
    }

    /// <summary>
    /// Update reservation DTO
    /// </summary>
    public class UpdateReservationDto
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public TimeSpan? PickupTime { get; set; }
        public TimeSpan? ReturnTime { get; set; }
        public string? Status { get; set; }
    }

    /// <summary>
    /// Reservation filter DTO
    /// </summary>
    public class ReservationFilterDto
    {
        public Guid? UserId { get; set; }
        public Guid? CarId { get; set; }
        public Guid? CircuitId { get; set; }
        public string? Status { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
