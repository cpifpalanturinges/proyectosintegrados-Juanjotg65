using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using gt_turing_backend.Data;
using gt_turing_backend.DTO;
using gt_turing_backend.Models;
using Microsoft.AspNetCore.SignalR;
using gt_turing_backend.Hubs;
using gt_turing_backend.Middleware;

namespace gt_turing_backend.Controllers
{
    /// <summary>
    /// Chat Controller / Controlador de Chat
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ChatController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<ChatHub> _hubContext;

        public ChatController(AppDbContext context, IHubContext<ChatHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        /// <summary>
        /// Get all conversations / Obtener todas las conversaciones
        /// </summary>
        [HttpGet("conversations")]
        [ProducesResponseType(typeof(IEnumerable<ConversationDto>), 200)]
        public async Task<IActionResult> GetConversations([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 20)
        {
            try
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
                var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

                if (userIdClaim == null)
                {
                    return Unauthorized();
                }

                var userId = Guid.Parse(userIdClaim.Value);
                var query = _context.Conversations
                    .Include(c => c.User)
                    .Include(c => c.Admin)
                    .Include(c => c.Messages)
                    .AsQueryable();

                // Admins see all conversations, users see only their own
                if (userRole != "Admin")
                {
                    query = query.Where(c => c.UserId == userId);
                }

                var totalCount = await query.CountAsync();
                var conversations = await query
                    .OrderByDescending(c => c.UpdatedAt)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var conversationDtos = conversations.Select(c => MapToConversationDto(c, userId)).ToList();

                Response.Headers.Append("X-Total-Count", totalCount.ToString());
                Response.Headers.Append("X-Page-Number", pageNumber.ToString());
                Response.Headers.Append("X-Page-Size", pageSize.ToString());

                return Ok(conversationDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        /// <summary>
        /// Get conversation by ID / Obtener conversación por ID
        /// </summary>
        [HttpGet("conversations/{id}")]
        [ProducesResponseType(typeof(ConversationDto), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetConversation(Guid id)
        {
            try
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
                var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

                if (userIdClaim == null)
                {
                    return Unauthorized();
                }

                var userId = Guid.Parse(userIdClaim.Value);
                var conversation = await _context.Conversations
                    .Include(c => c.User)
                    .Include(c => c.Admin)
                    .Include(c => c.Messages)
                        .ThenInclude(m => m.Sender)
                    .FirstOrDefaultAsync(c => c.Id == id);

                if (conversation == null)
                {
                    return NotFound(new { message = "Conversation not found" });
                }

                // Check authorization
                if (userRole != "Admin" && conversation.UserId != userId)
                {
                    return Forbid();
                }

                return Ok(MapToConversationDto(conversation, userId));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        /// <summary>
        /// Create new conversation / Crear nueva conversación
        /// </summary>
        [HttpPost("conversations")]
        [ProducesResponseType(typeof(ConversationDto), 201)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> CreateConversation([FromBody] CreateConversationDto conversationDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized();
                }

                var userId = Guid.Parse(userIdClaim.Value);

                var conversation = new Conversation
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    Subject = conversationDto.Subject,
                    Status = ConversationStatus.Open,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Conversations.Add(conversation);

                // Add initial message
                var message = new Message
                {
                    Id = Guid.NewGuid(),
                    ConversationId = conversation.Id,
                    SenderId = userId,
                    Content = conversationDto.InitialMessage,
                    SentAt = DateTime.UtcNow
                };

                _context.Messages.Add(message);
                await _context.SaveChangesAsync();

                // Load navigation properties
                await _context.Entry(conversation).Reference(c => c.User).LoadAsync();
                await _context.Entry(conversation).Collection(c => c.Messages).LoadAsync();

                // Notify all users via WebSocket (admins will see it)
                await WebSocketChatMiddleware.BroadcastMessage(conversation.Id.ToString(), new
                {
                    type = "ConversationCreated",
                    conversationId = conversation.Id.ToString(),
                    userId = userId.ToString(),
                    subject = conversation.Subject
                });

                return CreatedAtAction(nameof(GetConversation), new { id = conversation.Id }, MapToConversationDto(conversation, userId));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        /// <summary>
        /// Update conversation status / Actualizar estado de conversación (Admin only)
        /// </summary>
        [HttpPatch("conversations/{id}/status")]
        [Authorize(Policy = "AdminOnly")]
        [ProducesResponseType(typeof(ConversationDto), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> UpdateConversationStatus(Guid id, [FromBody] UpdateConversationStatusDto statusDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var conversation = await _context.Conversations
                    .Include(c => c.User)
                    .Include(c => c.Admin)
                    .Include(c => c.Messages)
                    .FirstOrDefaultAsync(c => c.Id == id);

                if (conversation == null)
                {
                    return NotFound(new { message = "Conversation not found" });
                }

                if (!Enum.TryParse<ConversationStatus>(statusDto.Status, true, out var status))
                {
                    return BadRequest(new { message = "Invalid status" });
                }

                conversation.Status = status;
                conversation.AdminId = statusDto.AdminId;
                conversation.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                // Notify user via SignalR
                await _hubContext.Clients.User(conversation.UserId.ToString()).SendAsync("ConversationStatusUpdated", MapToConversationDto(conversation, conversation.UserId));

                return Ok(MapToConversationDto(conversation, conversation.UserId));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        /// <summary>
        /// Get messages for a conversation / Obtener mensajes de una conversación
        /// </summary>
        [HttpGet("messages")]
        [ProducesResponseType(typeof(IEnumerable<MessageDto>), 200)]
        public async Task<IActionResult> GetMessages([FromQuery] Guid conversationId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 50)
        {
            try
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
                var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

                if (userIdClaim == null)
                {
                    return Unauthorized();
                }

                var userId = Guid.Parse(userIdClaim.Value);
                var conversation = await _context.Conversations.FindAsync(conversationId);

                if (conversation == null)
                {
                    return NotFound(new { message = "Conversation not found" });
                }

                // Check authorization
                if (userRole != "Admin" && conversation.UserId != userId)
                {
                    return Forbid();
                }

                var totalCount = await _context.Messages.CountAsync(m => m.ConversationId == conversationId);
                var messages = await _context.Messages
                    .Include(m => m.Sender)
                    .Where(m => m.ConversationId == conversationId)
                    .OrderBy(m => m.SentAt)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var messageDtos = messages.Select(MapToMessageDto).ToList();

                Response.Headers.Append("X-Total-Count", totalCount.ToString());
                Response.Headers.Append("X-Page-Number", pageNumber.ToString());
                Response.Headers.Append("X-Page-Size", pageSize.ToString());

                return Ok(messageDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        /// <summary>
        /// Send a message / Enviar un mensaje
        /// </summary>
        [HttpPost("messages")]
        [ProducesResponseType(typeof(MessageDto), 201)]
        [ProducesResponseType(400)]
        public async Task<IActionResult> SendMessage([FromBody] CreateMessageDto messageDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
                var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

                if (userIdClaim == null)
                {
                    return Unauthorized();
                }

                var userId = Guid.Parse(userIdClaim.Value);
                var conversation = await _context.Conversations
                    .Include(c => c.User)
                    .FirstOrDefaultAsync(c => c.Id == messageDto.ConversationId);

                if (conversation == null)
                {
                    return NotFound(new { message = "Conversation not found" });
                }

                // Check authorization
                if (userRole != "Admin" && conversation.UserId != userId)
                {
                    return Forbid();
                }

                var message = new Message
                {
                    Id = Guid.NewGuid(),
                    ConversationId = messageDto.ConversationId,
                    SenderId = userId,
                    Content = messageDto.Content,
                    AttachmentUrl = messageDto.AttachmentUrl,
                    SentAt = DateTime.UtcNow
                };

                _context.Messages.Add(message);

                // Update conversation
                conversation.UpdatedAt = DateTime.UtcNow;
                if (conversation.Status == ConversationStatus.Open && userRole == "Admin")
                {
                    conversation.Status = ConversationStatus.InProgress;
                    conversation.AdminId = userId;
                }

                await _context.SaveChangesAsync();

                // Load sender
                await _context.Entry(message).Reference(m => m.Sender).LoadAsync();

                var messageDto2 = MapToMessageDto(message);

                // Notify via WebSocket
                await WebSocketChatMiddleware.BroadcastMessage(conversation.Id.ToString(), new
                {
                    type = "ReceiveMessage",
                    id = message.Id.ToString(),
                    conversationId = conversation.Id.ToString(),
                    senderId = message.SenderId.ToString(),
                    senderName = message.Sender?.FirstName + " " + message.Sender?.LastName,
                    content = message.Content,
                    sentAt = message.SentAt,
                    isRead = message.IsRead
                });

                return CreatedAtAction(nameof(GetMessages), new { conversationId = messageDto.ConversationId }, messageDto2);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        /// <summary>
        /// Mark messages as read / Marcar mensajes como leídos
        /// </summary>
        [HttpPatch("messages/{id}/read")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> MarkMessageAsRead(Guid id)
        {
            try
            {
                var message = await _context.Messages
                    .Include(m => m.Conversation)
                    .FirstOrDefaultAsync(m => m.Id == id);

                if (message == null)
                {
                    return NotFound(new { message = "Message not found" });
                }

                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
                var userId = Guid.Parse(userIdClaim!.Value);

                // Only the recipient can mark as read
                if (message.SenderId == userId)
                {
                    return BadRequest(new { message = "Cannot mark own message as read" });
                }

                message.IsRead = true;
                await _context.SaveChangesAsync();

                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred", error = ex.Message });
            }
        }

        private ConversationDto MapToConversationDto(Conversation conversation, Guid currentUserId)
        {
            var unreadCount = conversation.Messages?.Count(m => !m.IsRead && m.SenderId != currentUserId) ?? 0;

            return new ConversationDto
            {
                Id = conversation.Id,
                UserId = conversation.UserId,
                AdminId = conversation.AdminId,
                Subject = conversation.Subject,
                Status = conversation.Status.ToString(),
                CreatedAt = conversation.CreatedAt,
                UpdatedAt = conversation.UpdatedAt,
                User = conversation.User != null ? new UserDto
                {
                    Id = conversation.User.Id,
                    Email = conversation.User.Email,
                    FirstName = conversation.User.FirstName,
                    LastName = conversation.User.LastName,
                    Phone = conversation.User.Phone,
                    Role = conversation.User.Role.ToString(),
                    IsBlocked = conversation.User.IsBlocked,
                    CreatedAt = conversation.User.CreatedAt
                } : null,
                Admin = conversation.Admin != null ? new UserDto
                {
                    Id = conversation.Admin.Id,
                    Email = conversation.Admin.Email,
                    FirstName = conversation.Admin.FirstName,
                    LastName = conversation.Admin.LastName,
                    Phone = conversation.Admin.Phone,
                    Role = conversation.Admin.Role.ToString(),
                    IsBlocked = conversation.Admin.IsBlocked,
                    CreatedAt = conversation.Admin.CreatedAt
                } : null,
                Messages = conversation.Messages?.Select(MapToMessageDto).ToList(),
                UnreadCount = unreadCount
            };
        }

        private MessageDto MapToMessageDto(Message message)
        {
            return new MessageDto
            {
                Id = message.Id,
                ConversationId = message.ConversationId,
                SenderId = message.SenderId,
                Content = message.Content,
                IsRead = message.IsRead,
                AttachmentUrl = message.AttachmentUrl,
                SentAt = message.SentAt,
                Sender = message.Sender != null ? new UserDto
                {
                    Id = message.Sender.Id,
                    Email = message.Sender.Email,
                    FirstName = message.Sender.FirstName,
                    LastName = message.Sender.LastName,
                    Phone = message.Sender.Phone,
                    Role = message.Sender.Role.ToString(),
                    IsBlocked = message.Sender.IsBlocked,
                    CreatedAt = message.Sender.CreatedAt
                } : null
            };
        }
    }
}
