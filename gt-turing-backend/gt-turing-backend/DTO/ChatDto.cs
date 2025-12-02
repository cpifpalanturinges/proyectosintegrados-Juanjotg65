using System.ComponentModel.DataAnnotations;

namespace gt_turing_backend.DTO
{
    /// <summary>
    /// Conversation DTO for responses
    /// </summary>
    public class ConversationDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid? AdminId { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        
        public UserDto? User { get; set; }
        public UserDto? Admin { get; set; }
        public List<MessageDto>? Messages { get; set; }
        public int UnreadCount { get; set; }
    }

    /// <summary>
    /// Create conversation DTO
    /// </summary>
    public class CreateConversationDto
    {
        [Required(ErrorMessage = "El asunto es obligatorio")]
        [StringLength(200, MinimumLength = 3, ErrorMessage = "El asunto debe tener entre 3 y 200 caracteres")]
        public string Subject { get; set; } = string.Empty;

        [Required(ErrorMessage = "El mensaje inicial es obligatorio")]
        [StringLength(5000, MinimumLength = 1, ErrorMessage = "El mensaje debe tener entre 1 y 5000 caracteres")]
        public string InitialMessage { get; set; } = string.Empty;
    }

    /// <summary>
    /// Message DTO for responses
    /// </summary>
    public class MessageDto
    {
        public Guid Id { get; set; }
        public Guid ConversationId { get; set; }
        public Guid SenderId { get; set; }
        public string Content { get; set; } = string.Empty;
        public bool IsRead { get; set; }
        public string? AttachmentUrl { get; set; }
        public DateTime SentAt { get; set; }
        
        public UserDto? Sender { get; set; }
    }

    /// <summary>
    /// Create message DTO
    /// </summary>
    public class CreateMessageDto
    {
        [Required(ErrorMessage = "El ID de conversación es obligatorio")]
        public Guid ConversationId { get; set; }

        [Required(ErrorMessage = "El contenido del mensaje es obligatorio")]
        [StringLength(5000, MinimumLength = 1, ErrorMessage = "El mensaje debe tener entre 1 y 5000 caracteres")]
        public string Content { get; set; } = string.Empty;

        [MaxLength(500, ErrorMessage = "La URL del adjunto no puede exceder 500 caracteres")]
        [Url(ErrorMessage = "La URL del adjunto no es válida")]
        public string? AttachmentUrl { get; set; }
    }

    /// <summary>
    /// Update conversation status DTO
    /// </summary>
    public class UpdateConversationStatusDto
    {
        [Required(ErrorMessage = "El estado es obligatorio")]
        [RegularExpression("^(Open|InProgress|Closed)$", 
            ErrorMessage = "Estado inválido. Valores permitidos: Open, InProgress, Closed")]
        public string Status { get; set; } = string.Empty;

        public Guid? AdminId { get; set; }
    }
}
