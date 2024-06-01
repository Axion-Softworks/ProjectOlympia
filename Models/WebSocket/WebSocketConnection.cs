using System.Net.WebSockets;

namespace ProjectOlympia
{
    public class WebSocketConnection
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public WebSocket WebSocket { get; set; }

        public WebSocketConnection(Guid id, WebSocket webSocket)
        {
            this.Id = id;
            this.WebSocket = webSocket;
        }
    }
}