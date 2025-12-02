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
        [Required(ErrorMessage = "El nombre es obligatorio")]
        [StringLength(200, MinimumLength = 3, ErrorMessage = "El nombre debe tener entre 3 y 200 caracteres")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "La ubicación es obligatoria")]
        [StringLength(200, MinimumLength = 5, ErrorMessage = "La ubicación debe tener entre 5 y 200 caracteres")]
        public string Location { get; set; } = string.Empty;

        [Required(ErrorMessage = "La provincia es obligatoria")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "La provincia debe tener entre 3 y 100 caracteres")]
        public string Province { get; set; } = string.Empty;

        [Required(ErrorMessage = "La longitud es obligatoria")]
        [Range(500, 10000, ErrorMessage = "La longitud debe estar entre 500 y 10000 metros")]
        public int LengthMeters { get; set; }

        [Required(ErrorMessage = "La anchura es obligatoria")]
        [Range(5, 50, ErrorMessage = "La anchura debe estar entre 5 y 50 metros")]
        public decimal WidthMeters { get; set; }

        [Required(ErrorMessage = "El tipo de superficie es obligatorio")]
        [RegularExpression("^(Asphalt|Concrete|Mixed)$", 
            ErrorMessage = "Tipo de superficie inválido. Valores permitidos: Asphalt, Concrete, Mixed")]
        public string SurfaceType { get; set; } = string.Empty;

        [Range(0, 500, ErrorMessage = "El desnivel debe estar entre 0 y 500 metros")]
        public int? ElevationChange { get; set; }

        [Range(1, 50, ErrorMessage = "El número de curvas debe estar entre 1 y 50")]
        public int? NumberOfCorners { get; set; }

        public bool IsAvailable { get; set; } = true;

        [MaxLength(500, ErrorMessage = "La URL de la imagen no puede exceder 500 caracteres")]
        public string? ImageUrl { get; set; }

        [MaxLength(2000, ErrorMessage = "La descripción no puede exceder 2000 caracteres")]
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
        public int PageSize { get; set; } = 100; // Aumentado para admin
    }
}
