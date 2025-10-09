using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace gt_turing_backend.Models
{
    /// <summary>
    /// Conversation status enum / Enumeración de estado de conversación
    /// </summary>
    public enum ConversationStatus
    {
        Open,
        InProgress,
        Closed
    }

    /// <summary>
    /// Conversation entity / Entidad de conversación
    /// </summary>
    public class Conversation
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid UserId { get; set; }

        public Guid? AdminId { get; set; }

        [Required]
        [MaxLength(200)]
        public string Subject { get; set; } = string.Empty;

        [Required]
        public ConversationStatus Status { get; set; } = ConversationStatus.Open;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("UserId")]
        public User User { get; set; } = null!;

        [ForeignKey("AdminId")]
        public User? Admin { get; set; }

        public ICollection<Message> Messages { get; set; } = new List<Message>();
    }
}
