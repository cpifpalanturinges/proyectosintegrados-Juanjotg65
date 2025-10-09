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
        [Required]
        [MaxLength(200)]
        public string Subject { get; set; } = string.Empty;

        [Required]
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
        [Required]
        public Guid ConversationId { get; set; }

        [Required]
        public string Content { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? AttachmentUrl { get; set; }
    }

    /// <summary>
    /// Update conversation status DTO
    /// </summary>
    public class UpdateConversationStatusDto
    {
        [Required]
        public string Status { get; set; } = string.Empty;

        public Guid? AdminId { get; set; }
    }
}
