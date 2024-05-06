using System.Net.WebSockets;

using Microsoft.AspNetCore.Mvc;

namespace ProjectOlympia.Controllers
{
    // Based on MS Documentation - https://learn.microsoft.com/en-us/aspnet/core/fundamentals/websockets?view=aspnetcore-7.0
    // Maintaining Web Socket connections - Do the following
        // https://peterdaugaardrasmussen.com/2020/03/14/asp-net-websockets-sending-messages-back-and-forth-between-client-and-server-with-example/

    public class WebSocketController : ControllerBase
    {
        public WebSocketController()
        {
            Console.WriteLine();
        }

        [Route("/ws")]
        public async Task Test()
        {
            if (HttpContext.WebSockets.IsWebSocketRequest == false)
            {
                this.HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;

                return;
            }

            using WebSocket webSocket = await this.HttpContext.WebSockets.AcceptWebSocketAsync();
            
            await Echo(webSocket);
        }

        private static async Task Echo(WebSocket webSocket)
        {
            var buffer = new byte[1024 * 4];
            WebSocketReceiveResult receiveResult = await webSocket.ReceiveAsync(
                new ArraySegment<byte>(buffer), CancellationToken.None
            );

            while (!receiveResult.CloseStatus.HasValue)
            {
                await webSocket.SendAsync(
                    new ArraySegment<byte>(buffer, 0, receiveResult.Count),
                    receiveResult.MessageType,
                    receiveResult.EndOfMessage,
                    CancellationToken.None
                );

                receiveResult = await webSocket.ReceiveAsync(
                    new ArraySegment<byte>(buffer), CancellationToken.None
                );
            }

            await webSocket.CloseAsync(
                receiveResult.CloseStatus.Value,
                receiveResult.CloseStatusDescription,
                CancellationToken.None
            );
        }
    }
}