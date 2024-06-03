using System.Net.WebSockets;

namespace ProjectOlympia
{
    public interface IWebSocketHandler
    {
        Task Handle(Guid id, WebSocket webSocket);
        Task SendMessageToUsersAsync(string messageJson, List<Guid> recipientUserIds);
    }
}