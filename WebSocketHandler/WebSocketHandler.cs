using System.Net.WebSockets;
using System.Text;

using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace ProjectOlympia
{
    public class WebSocketHandler : IWebSocketHandler
    {
        private readonly ILogger<WebSocketHandler> logger;

        private List<WebSocketConnection> webSocketConnections = new List<WebSocketConnection>();

        public WebSocketHandler(ILogger<WebSocketHandler> logger)
        {
            this.logger = logger;

            // Move to program/startup ???
            JsonConvert.DefaultSettings = () => new JsonSerializerSettings()
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            };

            this.SetupCleanUpTask();
        }

        public async Task Handle(Guid id, WebSocket webSocket)
        {
            lock (this.webSocketConnections)
            {
                var webSocketConnection = new WebSocketConnection(id, webSocket);
                
                this.webSocketConnections.Add(webSocketConnection);
            }

            while (webSocket.State == WebSocketState.Open)
            {
                string json = await this.ReceiveMessage(id, webSocket);

                if (string.IsNullOrWhiteSpace(json))
                    return;

                var message = JsonConvert.DeserializeObject<WebSocketRequest>(json);

                if (message == null)
                    return;

                this.logger.LogInformation("Received message with operation: {op}", message.Operation);

                switch (message.Operation)
                {
                    case EWebSocketOperation.Auth:
                        this.OnAuthenticate(id, message.UserId);

                        break;

                    default:
                        break;
                }
            }
        }
        
        public async Task SendMessageToUsersAsync(string messageJson, List<Guid> recipientUserIds)
        {
            List<WebSocketConnection> toSendTo;

            lock (this.webSocketConnections)
            {
                toSendTo = this.webSocketConnections.Where(x => recipientUserIds.Contains(x.UserId)).ToList();
            }

            var tasks = toSendTo.Select(async connection =>
            {
               byte[] bytes = Encoding.Default.GetBytes(messageJson);
               var arraySegment = new ArraySegment<byte>(bytes);

               if (connection.WebSocket.State != WebSocketState.Open)
                return;

                await connection.WebSocket.SendAsync(
                    arraySegment,
                    WebSocketMessageType.Text,
                    true,
                    CancellationToken.None
                );
            });

            await Task.WhenAll(tasks);
        }

        private async Task<string> ReceiveMessage(Guid id, WebSocket webSocket)
        {
            var arraySegment = new ArraySegment<byte>(new byte[4096]);
            WebSocketReceiveResult receivedMessage = await webSocket.ReceiveAsync(arraySegment, CancellationToken.None);

            if (receivedMessage.MessageType == WebSocketMessageType.Text)
            {
                string message = Encoding.Default.GetString(arraySegment).TrimEnd('\0');

                if (string.IsNullOrWhiteSpace(message) == false)
                {
                    this.logger.LogInformation("Player with ID '{id}' said: '{message}'", id, message);

                    return message;
                }
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

        private void OnAuthenticate(Guid webSocketId, Guid userId)
        {
            this.logger.LogInformation("Authenticating Web Socket Connection: '{wsid}' with User: '{userId}'", webSocketId, userId);

            lock (this.webSocketConnections)
            {
                WebSocketConnection? connection = this.webSocketConnections.FirstOrDefault(x => x.Id == webSocketId);

                if (connection == null)
                    return;

                connection.UserId = userId;
            }
        }
    }
}