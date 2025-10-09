using System.ComponentModel.DataAnnotations;

namespace gt_turing_backend.DTO
{
    /// <summary>
    /// Car DTO for responses
    /// </summary>
    public class CarDto
    {
        public Guid Id { get; set; }
        public string Model { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public int Year { get; set; }
        public int Power { get; set; }
        public string Type { get; set; } = string.Empty;
        public decimal PricePerDay { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    /// <summary>
    /// Create/Update car DTO
    /// </summary>
    public class CreateUpdateCarDto
    {
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
        public string Type { get; set; } = string.Empty;

        [Required]
        [Range(0, 100000)]
        public decimal PricePerDay { get; set; }

        [Required]
        public string Status { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? ImageUrl { get; set; }

        public string? Description { get; set; }
    }

    /// <summary>
    /// Car filter DTO for queries
    /// </summary>
    public class CarFilterDto
    {
        public string? Type { get; set; }
        public string? Status { get; set; }
        public int? MinPower { get; set; }
        public int? MaxPower { get; set; }
        public decimal? MaxPrice { get; set; }
        public string? Brand { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
