using System.Net.WebSockets;

namespace ProjectOlympia
{
    public interface IWebSocketHandler
    {
        Task Handle(Guid id, WebSocket webSocket);
    }
}