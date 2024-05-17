using System.Net.WebSockets;
using System.Text;

namespace ProjectOlympia
{
    public class WebSocketHandler : IWebSocketHandler
    {
        private readonly ILogger<WebSocketHandler> logger;

        private List<WebSocketConnection> webSocketConnections = new List<WebSocketConnection>();

        public WebSocketHandler(ILogger<WebSocketHandler> logger)
        {
            this.logger = logger;

            this.SetupCleanUpTask();
        }

        public async Task Handle(Guid id, WebSocket webSocket)
        {
            lock (this.webSocketConnections)
            {
                var webSocketConnection = new WebSocketConnection(id, webSocket);
                
                this.webSocketConnections.Add(webSocketConnection);
            }

            // send message to sockets - "x is choosing athletes"??

            while (webSocket.State == WebSocketState.Open)
            {
                string message = await this.ReceiveMessage(id, webSocket);

                if (string.IsNullOrWhiteSpace(message))
                    return;

                await this.SendMessageToSockets(message);
            }
        }

        private async Task<string> ReceiveMessage(Guid id, WebSocket webSocket)
        {
            var arraySegment = new ArraySegment<byte>(new byte[4096]);
            WebSocketReceiveResult receivedMessage = await webSocket.ReceiveAsync(arraySegment, CancellationToken.None);

            if (receivedMessage.MessageType == WebSocketMessageType.Text)
            {
                string message = Encoding.Default.GetString(arraySegment).TrimEnd('\0');

                if (string.IsNullOrWhiteSpace(message) == false)
                    return $"Player with ID '{id}' said: '{message}'";
            }

            return string.Empty;
        }

        private async Task SendMessageToSockets(string message)
        {
            List<WebSocketConnection> toSendTo;

            lock (webSocketConnections)
            {
                toSendTo = webSocketConnections.ToList();
            }

            var tasks = toSendTo.Select(async webSocketConnection =>
            {
                byte[] bytes = Encoding.Default.GetBytes(message);
                var arraySegment = new ArraySegment<byte>(bytes);

                await webSocketConnection.WebSocket.SendAsync(
                    arraySegment,
                    WebSocketMessageType.Text,
                    true,
                    CancellationToken.None
                );
            });

            await Task.WhenAll(tasks);
        }

        private void SetupCleanUpTask()
        {
            Task.Run(async () =>
            {
                while (true)
                {
                    List<WebSocketConnection> openSockets, closedSockets;

                    lock (this.webSocketConnections)
                    {
                        openSockets = webSocketConnections.Where(x => x.WebSocket.State == WebSocketState.Open || x.WebSocket.State == WebSocketState.Connecting).ToList();
                        closedSockets = webSocketConnections.Where(x => x.WebSocket.State != WebSocketState.Open && x.WebSocket.State != WebSocketState.Connecting).ToList();

                        this.webSocketConnections = openSockets;
                    }

                    foreach (var closedSocket in closedSockets)
                    {
                        // send message to other connections??

                        this.logger.LogInformation("Closing Web Socket Connection: {id}", closedSocket.Id);
                    }

                    await Task.Delay(5000);
                }
            });
        }
    }
}