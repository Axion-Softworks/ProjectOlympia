namespace ProjectOlympia
{
    public interface IWebSocketService
    {
        Task SendAthleteAssignedMessageAsync(Guid userId, Guid athleteId, List<Guid> draftUserIds);
        Task SendDraftStartedMessageAsync(Guid draftId, List<Guid> draftUserIds);
        Task SendDraftRandomisedMessageAsync(Guid draftId, List<Guid> draftUserIds, List<string> draftOrder);
    }
}