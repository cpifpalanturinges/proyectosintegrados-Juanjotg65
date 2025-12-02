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
        [Required(ErrorMessage = "El modelo es obligatorio")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "El modelo debe tener entre 2 y 100 caracteres")]
        public string Model { get; set; } = string.Empty;

        [Required(ErrorMessage = "La marca es obligatoria")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "La marca debe tener entre 2 y 50 caracteres")]
        public string Brand { get; set; } = string.Empty;

        [Required(ErrorMessage = "El año es obligatorio")]
        [Range(1900, 2100, ErrorMessage = "El año debe estar entre 1900 y 2100")]
        public int Year { get; set; }

        [Required(ErrorMessage = "La potencia es obligatoria")]
        [Range(50, 2000, ErrorMessage = "La potencia debe estar entre 50 y 2000 CV")]
        public int Power { get; set; }

        [Required(ErrorMessage = "El tipo es obligatorio")]
        [RegularExpression("^(Racing|Drift|Hybrid)$", 
            ErrorMessage = "Tipo inválido. Valores permitidos: Racing, Drift, Hybrid")]
        public string Type { get; set; } = string.Empty;

        [Required(ErrorMessage = "El precio por día es obligatorio")]
        [Range(1, 100000, ErrorMessage = "El precio debe estar entre 1 y 100000")]
        public decimal PricePerDay { get; set; }

        [Required(ErrorMessage = "El estado es obligatorio")]
        [RegularExpression("^(Available|Rented|Maintenance)$", 
            ErrorMessage = "Estado inválido. Valores permitidos: Available, Rented, Maintenance")]
        public string Status { get; set; } = string.Empty;

        [MaxLength(500, ErrorMessage = "La URL de la imagen no puede exceder 500 caracteres")]
        public string? ImageUrl { get; set; }

        [MaxLength(2000, ErrorMessage = "La descripción no puede exceder 2000 caracteres")]
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
        public int PageSize { get; set; } = 100; // Aumentado para admin
    }
}
