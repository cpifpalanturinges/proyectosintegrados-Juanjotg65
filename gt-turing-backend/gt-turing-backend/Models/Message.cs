using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace gt_turing_backend.Models
{
    /// <summary>
    /// Message entity / Entidad de mensaje
    /// </summary>
    public class Message
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid ConversationId { get; set; }

        [Required]
        public Guid SenderId { get; set; }

        [Required]
        public string Content { get; set; } = string.Empty;

        public bool IsRead { get; set; } = false;

        [MaxLength(500)]
        public string? AttachmentUrl { get; set; }

        public DateTime SentAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("ConversationId")]
        public Conversation Conversation { get; set; } = null!;

        [ForeignKey("SenderId")]
        public User Sender { get; set; } = null!;
    }
}
