using System.Net.WebSockets;

using Microsoft.AspNetCore.Mvc;

namespace ProjectOlympia.Controllers
{
    // Based on MS Documentation - https://learn.microsoft.com/en-us/aspnet/core/fundamentals/websockets?view=aspnetcore-7.0
    // Maintaining Web Socket connections - Do the following
        // https://peterdaugaardrasmussen.com/2020/03/14/asp-net-websockets-sending-messages-back-and-forth-between-client-and-server-with-example/

    public class WebSocketController : ControllerBase
    {
        private readonly ILogger<WebSocketController> logger;
        private readonly IWebSocketHandler webSocketHandler;

        public WebSocketController(
            ILogger<WebSocketController> logger,
            IWebSocketHandler webSocketHandler
        )
        {
            this.logger = logger;
            this.webSocketHandler = webSocketHandler;
        }

        [Route("/ws")]
        public async Task Connect()
        {
            if (this.HttpContext.WebSockets.IsWebSocketRequest == false)
            {
                this.HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;

                return;
            }

            using WebSocket webSocket = await this.HttpContext.WebSockets.AcceptWebSocketAsync();
            
            await this.webSocketHandler.Handle(Guid.NewGuid(), webSocket);
        }
    }
}