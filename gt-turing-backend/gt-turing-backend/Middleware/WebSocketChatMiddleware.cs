using System.Collections.Concurrent;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using gt_turing_backend.Data;
using gt_turing_backend.Services;

namespace gt_turing_backend.Middleware
{
    public class WebSocketChatMiddleware
    {
        private readonly RequestDelegate _next;
        private static readonly ConcurrentDictionary<string, WebSocket> _connections = new();

        public WebSocketChatMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, AppDbContext dbContext, IJwtService jwtService)
        {
            if (context.Request.Path == "/ws/chat")
            {
                if (context.WebSockets.IsWebSocketRequest)
                {
                    // Get userId and token from query string
                    var userId = context.Request.Query["userId"].ToString();
                    var token = context.Request.Query["token"].ToString();

                    if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(token))
                    {
                        context.Response.StatusCode = 400;
                        await context.Response.WriteAsync("Missing userId or token");
                        return;
                    }

                    // Validate token
                    try
                    {
                        var principal = jwtService.ValidateToken(token);
                        if (principal == null)
                        {
                            context.Response.StatusCode = 401;
                            await context.Response.WriteAsync("Invalid token");
                            return;
                        }
                    }
                    catch
                    {
                        context.Response.StatusCode = 401;
                        await context.Response.WriteAsync("Unauthorized");
                        return;
                    }

                    var webSocket = await context.WebSockets.AcceptWebSocketAsync();
                    var connectionId = $"{userId}_{Guid.NewGuid()}";

                    _connections.TryAdd(connectionId, webSocket);

                    Console.WriteLine($"✅ WebSocket connected: {connectionId} (User: {userId})");

                    try
                    {
                        await HandleWebSocketConnection(connectionId, userId, webSocket, dbContext);
                    }
                    finally
                    {
                        _connections.TryRemove(connectionId, out _);
                        Console.WriteLine($"❌ WebSocket disconnected: {connectionId}");
                    }
                }
                else
                {
                    context.Response.StatusCode = 400;
                }
            }
            else
            {
                await _next(context);
            }
        }

        private async Task HandleWebSocketConnection(string connectionId, string userId, WebSocket webSocket, AppDbContext dbContext)
        {
            var buffer = new byte[1024 * 4];

            while (webSocket.State == WebSocketState.Open)
            {
                var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

                if (result.MessageType == WebSocketMessageType.Text)
                {
                    var messageJson = Encoding.UTF8.GetString(buffer, 0, result.Count);
                    
                    try
                    {
                        var message = JsonSerializer.Deserialize<WebSocketMessage>(messageJson);
                        
                        if (message?.type == "JoinConversation" && !string.IsNullOrEmpty(message.conversationId))
                        {
                            // User joined a conversation - no need to do anything for now
                            Console.WriteLine($"User {userId} joined conversation {message.conversationId}");
                        }
                        else if (message?.type == "SendMessage")
                        {
                            // Handle sending message (optional - can use HTTP POST instead)
                            Console.WriteLine($"Message from {userId}: {message.content}");
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error processing WebSocket message: {ex.Message}");
                    }
                }
                else if (result.MessageType == WebSocketMessageType.Close)
                {
                    await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closing", CancellationToken.None);
                    break;
                }
            }
        }

        public static async Task BroadcastMessage(string conversationId, object messageData)
        {
            var messageJson = JsonSerializer.Serialize(messageData);
            var messageBytes = Encoding.UTF8.GetBytes(messageJson);

            var tasks = _connections.Values
                .Where(ws => ws.State == WebSocketState.Open)
                .Select(ws => ws.SendAsync(
                    new ArraySegment<byte>(messageBytes),
                    WebSocketMessageType.Text,
                    true,
                    CancellationToken.None
                ));

            await Task.WhenAll(tasks);
        }

        private class WebSocketMessage
        {
            public string? type { get; set; }
            public string? conversationId { get; set; }
            public string? content { get; set; }
        }

        /// <summary>
        /// Get all connected user IDs
        /// </summary>
        public static List<string> GetConnectedUserIds()
        {
            return _connections.Keys
                .Select(key => key.Split('_')[0])
                .Distinct()
                .ToList();
        }
    }

    public static class WebSocketChatMiddlewareExtensions
    {
        public static IApplicationBuilder UseWebSocketChat(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<WebSocketChatMiddleware>();
        }
    }
}
