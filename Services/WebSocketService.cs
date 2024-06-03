using Newtonsoft.Json;

namespace ProjectOlympia
{
    public class WebSocketService : IWebSocketService
    {
        private readonly IWebSocketHandler _webSocketHandler;

        public WebSocketService(IWebSocketHandler webSocketHandler)
        {
            this._webSocketHandler = webSocketHandler;
        }

        public async Task SendAthleteAssignedMessageAsync(Guid userId, Guid athleteId, List<Guid> draftUserIds)
        {
            var response = new AthleteDraftedResponse
            {
                AthleteId = athleteId,
                UserId = userId
            };

            string responseJson = JsonConvert.SerializeObject(response);

            var message = new WebSocketResponse
            {
                Operation = EWebSocketOperation.AthleteDrafted,
                Content = responseJson
            };

            string messageJson = JsonConvert.SerializeObject(message);

            await this._webSocketHandler.SendMessageToUsersAsync(messageJson, draftUserIds);
        }

        public async Task SendDraftStartedMessageAsync(Guid draftId, List<Guid> draftUserIds)
        {
            var response = new DraftOpenedResponse
            {
                DraftId = draftId,
                Status = EDraftStatus.InProgress
            };

            string responseJson = JsonConvert.SerializeObject(response);

            var message = new WebSocketResponse
            {
                Operation = EWebSocketOperation.DraftOpened,
                Content = responseJson
            };

            string messageJson = JsonConvert.SerializeObject(message);

            await this._webSocketHandler.SendMessageToUsersAsync(messageJson, draftUserIds);
        }
    }
}