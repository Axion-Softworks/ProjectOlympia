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

        public async Task SendAthleteAssignedMessageAsync(Guid userId, List<Guid> draftUserIds, Guid athleteId)
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

        public async Task SendDraftStateChangedMessageAsync(Guid draftId, List<Guid> draftUserIds, EDraftStatus status)
        {
            var response = new DraftStatusResponse
            {
                DraftId = draftId,
                Status = status
            };

            string responseJson = JsonConvert.SerializeObject(response);

            var message = new WebSocketResponse
            {
                Operation = EWebSocketOperation.StatusChanged,
                Content = responseJson
            };

            string messageJson = JsonConvert.SerializeObject(message);

            await this._webSocketHandler.SendMessageToUsersAsync(messageJson, draftUserIds);
        }

        public async Task SendDraftRandomisedMessageAsync(Guid draftId, List<Guid> draftUserIds, List<string> draftOrder)
        {
            var response = new DraftRandomisedResponse
            {
                DraftId = draftId,
                DraftOrder = draftOrder
            };

            string responseJson = JsonConvert.SerializeObject(response);

            var message = new WebSocketResponse
            {
                Operation = EWebSocketOperation.DraftRandomised,
                Content = responseJson
            };

            string messageJson = JsonConvert.SerializeObject(message);

            await this._webSocketHandler.SendMessageToUsersAsync(messageJson, draftUserIds);
        }

        public async Task SendGroupDraftRandomisedMessageAsync(Guid draftId, List<Guid> draftUserIds, List<AthleteGroup> athleteGroups)
        {
            var response = new GroupDraftRandomisedResponse
            {
                DraftId = draftId,
                AthleteGroups = athleteGroups
            };

            string responseJson = JsonConvert.SerializeObject(response);

            var message = new WebSocketResponse
            {
                Operation = EWebSocketOperation.GroupDraftRandomised,
                Content = responseJson
            };

            string messageJson = JsonConvert.SerializeObject(message);

            await this._webSocketHandler.SendMessageToUsersAsync(messageJson, draftUserIds);
        }

        public async Task SendAthleteGroupDraftedMessageAsync(Guid userId, List<Guid> draftUserIds, int group) 
        {
            var response = new AthleteGroupDraftedResponse
            {
                Group = group,
                UserId = userId
            };

            string responseJson = JsonConvert.SerializeObject(response);

            var message = new WebSocketResponse
            {
                Operation = EWebSocketOperation.AthleteGroupDrafted,
                Content = responseJson
            };

            string messageJson = JsonConvert.SerializeObject(message);

            await this._webSocketHandler.SendMessageToUsersAsync(messageJson, draftUserIds);
        }

    }
}