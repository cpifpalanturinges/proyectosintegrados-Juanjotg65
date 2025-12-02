using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using System.Collections.Concurrent;
using gt_turing_backend.Data;
using gt_turing_backend.Models;

namespace gt_turing_backend.Services
{
    // Simple in-memory WebSocket manager for chat connections
    public static class WebSocketChatService
    {
        // userId -> websocket
        private static readonly ConcurrentDictionary<Guid, WebSocket> _connections = new();

        public static void AddConnection(Guid userId, WebSocket socket)
        {
            _connections[userId] = socket;
        }

        public static void RemoveConnection(Guid userId)
        {
            _connections.TryRemove(userId, out _);
        }

        public static IEnumerable<KeyValuePair<Guid, WebSocket>> GetAllConnections() => _connections;

        public static async Task BroadcastToAdminsAsync(AppDbContext dbContext, object payload)
        {
            var adminIds = dbContext.Users.Where(u => u.Role == gt_turing_backend.Models.UserRole.Admin).Select(u => u.Id).ToList();
            var json = JsonSerializer.Serialize(payload);
            var bytes = Encoding.UTF8.GetBytes(json);
            var segment = new ArraySegment<byte>(bytes);

            foreach (var adminId in adminIds)
            {
                if (_connections.TryGetValue(adminId, out var ws) && ws.State == WebSocketState.Open)
                {
                    try
                    {
                        await ws.SendAsync(segment, WebSocketMessageType.Text, true, CancellationToken.None);
                    }
                    catch { /* ignore per-connection failures */ }
                }
            }
        }

        public static async Task SendToUserAsync(Guid userId, object payload)
        {
            if (_connections.TryGetValue(userId, out var ws) && ws.State == WebSocketState.Open)
            {
                var json = JsonSerializer.Serialize(payload);
                var bytes = Encoding.UTF8.GetBytes(json);
                var segment = new ArraySegment<byte>(bytes);
                try
                {
                    await ws.SendAsync(segment, WebSocketMessageType.Text, true, CancellationToken.None);
                }
                catch { }
            }
        }
    }
}
