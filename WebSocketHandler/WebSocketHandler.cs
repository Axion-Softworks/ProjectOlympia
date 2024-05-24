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

                await this.SendMessageToSockets(message, id);
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

        private async Task SendMessageToSockets(string message, Guid id)
        {
            List<WebSocketConnection> toSendTo;

            lock (this.webSocketConnections)
            {
                toSendTo = this.webSocketConnections.Where(x => x.Id != id).ToList();
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
                    var openSockets = new List<WebSocketConnection>();

                    lock (this.webSocketConnections)
                    {
                        foreach (WebSocketConnection connection in this.webSocketConnections)
                        {
                            if (connection == null || connection.WebSocket == null)
                                continue;

                            if (connection.WebSocket.State == WebSocketState.Open || connection.WebSocket.State == WebSocketState.Connecting)
                            {
                                openSockets.Add(connection);
                            }
                            else
                            {
                                this.logger.LogInformation("Web Socket: '{id}' closed", connection.Id);
                            }
                        }

                        this.webSocketConnections = openSockets;
                    }

                    await Task.Delay(5000);
                }
            });
        }
    }
}