using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace gt_turing_backend.Hubs
{
    /// <summary>
    /// SignalR Hub for real-time chat functionality
    /// Hub de SignalR para funcionalidad de chat en tiempo real
    /// </summary>
    [Authorize]
    public class ChatHub : Hub
    {
        /// <summary>
        /// Called when a client connects to the hub
        /// </summary>
        public override async Task OnConnectedAsync()
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = Context.User?.FindFirst(ClaimTypes.Role)?.Value;

            if (userId != null)
            {
                // Add user to their personal group
                await Groups.AddToGroupAsync(Context.ConnectionId, $"User_{userId}");

                // Add admins to the Admins group
                if (userRole == "Admin")
                {
                    await Groups.AddToGroupAsync(Context.ConnectionId, "Admins");
                }

                Console.WriteLine($"User {userId} connected to ChatHub");
            }

            await base.OnConnectedAsync();
        }

        /// <summary>
        /// Called when a client disconnects from the hub
        /// </summary>
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = Context.User?.FindFirst(ClaimTypes.Role)?.Value;

            if (userId != null)
            {
                // Remove user from their personal group
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"User_{userId}");

                // Remove admins from the Admins group
                if (userRole == "Admin")
                {
                    await Groups.RemoveFromGroupAsync(Context.ConnectionId, "Admins");
                }

                Console.WriteLine($"User {userId} disconnected from ChatHub");
            }

            await base.OnDisconnectedAsync(exception);
        }

        /// <summary>
        /// Join a specific conversation group
        /// Unirse a un grupo de conversación específico
        /// </summary>
        public async Task JoinConversation(string conversationId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"Conversation_{conversationId}");
            Console.WriteLine($"User joined conversation {conversationId}");
        }

        /// <summary>
        /// Leave a specific conversation group
        /// Salir de un grupo de conversación específico
        /// </summary>
        public async Task LeaveConversation(string conversationId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"Conversation_{conversationId}");
            Console.WriteLine($"User left conversation {conversationId}");
        }

        /// <summary>
        /// Send typing indicator to conversation
        /// Enviar indicador de escritura a la conversación
        /// </summary>
        public async Task SendTypingIndicator(string conversationId, string userName)
        {
            await Clients.OthersInGroup($"Conversation_{conversationId}").SendAsync("UserTyping", userName);
        }

        /// <summary>
        /// Stop typing indicator
        /// Detener indicador de escritura
        /// </summary>
        public async Task StopTypingIndicator(string conversationId, string userName)
        {
            await Clients.OthersInGroup($"Conversation_{conversationId}").SendAsync("UserStoppedTyping", userName);
        }

        /// <summary>
        /// Notify user is online
        /// Notificar que el usuario está en línea
        /// </summary>
        public async Task NotifyOnline()
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId != null)
            {
                await Clients.All.SendAsync("UserOnline", userId);
            }
        }

        /// <summary>
        /// Notify user is offline
        /// Notificar que el usuario está desconectado
        /// </summary>
        public async Task NotifyOffline()
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId != null)
            {
                await Clients.All.SendAsync("UserOffline", userId);
            }
        }
    }
}
