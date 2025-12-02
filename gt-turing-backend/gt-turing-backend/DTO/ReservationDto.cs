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
        [Required(ErrorMessage = "El coche es obligatorio")]
        public Guid CarId { get; set; }

        [Required(ErrorMessage = "El circuito es obligatorio")]
        public Guid CircuitId { get; set; }

        [Required(ErrorMessage = "La fecha de inicio es obligatoria")]
        [DataType(DataType.Date)]
        public DateTime StartDate { get; set; }

        [Required(ErrorMessage = "La fecha de fin es obligatoria")]
        [DataType(DataType.Date)]
        public DateTime EndDate { get; set; }

        [Required(ErrorMessage = "La hora de recogida es obligatoria")]
        [DataType(DataType.Time)]
        public TimeSpan PickupTime { get; set; }

        [Required(ErrorMessage = "La hora de devolución es obligatoria")]
        [DataType(DataType.Time)]
        public TimeSpan ReturnTime { get; set; }
    }

    /// <summary>
    /// Update reservation DTO
    /// </summary>
    public class UpdateReservationDto
    {
        [DataType(DataType.Date)]
        public DateTime? StartDate { get; set; }

        [DataType(DataType.Date)]
        public DateTime? EndDate { get; set; }

        [DataType(DataType.Time)]
        public TimeSpan? PickupTime { get; set; }

        [DataType(DataType.Time)]
        public TimeSpan? ReturnTime { get; set; }

        [StringLength(20, ErrorMessage = "El estado no puede exceder 20 caracteres")]
        [RegularExpression("^(Pending|Confirmed|Cancelled|Completed)$", 
            ErrorMessage = "Estado inválido. Valores permitidos: Pending, Confirmed, Cancelled, Completed")]
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
        // Pagination removed: frontend will handle paging client-side.
    }

    /// <summary>
    /// Occupied date DTO for calendar
    /// </summary>
    public class OccupiedDateDto
    {
        public Guid ReservationId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
