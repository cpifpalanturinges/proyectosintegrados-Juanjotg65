using System.ComponentModel.DataAnnotations;

namespace gt_turing_backend.DTO
{
    /// <summary>
    /// Circuit DTO for responses
    /// </summary>
    public class CircuitDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Province { get; set; } = string.Empty;
        public int LengthMeters { get; set; }
        public decimal WidthMeters { get; set; }
        public string SurfaceType { get; set; } = string.Empty;
        public int? ElevationChange { get; set; }
        public int? NumberOfCorners { get; set; }
        public bool IsAvailable { get; set; }
        public string? ImageUrl { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    /// <summary>
    /// Create/Update circuit DTO
    /// </summary>
    public class CreateUpdateCircuitDto
    {
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
        public string SurfaceType { get; set; } = string.Empty;

        [Range(0, 500)]
        public int? ElevationChange { get; set; }

        [Range(1, 50)]
        public int? NumberOfCorners { get; set; }

        public bool IsAvailable { get; set; } = true;

        [MaxLength(500)]
        public string? ImageUrl { get; set; }

        public string? Description { get; set; }
    }

    /// <summary>
    /// Circuit filter DTO for queries
    /// </summary>
    public class CircuitFilterDto
    {
        public string? Province { get; set; }
        public string? SurfaceType { get; set; }
        public int? MinLength { get; set; }
        public int? MaxLength { get; set; }
        public bool? IsAvailable { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
