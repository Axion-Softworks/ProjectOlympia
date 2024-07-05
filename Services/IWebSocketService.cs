namespace ProjectOlympia
{
    public interface IWebSocketService
    {
        Task SendAthleteAssignedMessageAsync(Guid userId, List<Guid> draftUserIds, Guid athleteId);
        Task SendDraftStateChangedMessageAsync(Guid draftId, List<Guid> draftUserIds, EDraftStatus status);
        Task SendDraftRandomisedMessageAsync(Guid draftId, List<Guid> draftUserIds, List<string> draftOrder);
        Task SendGroupDraftRandomisedMessageAsync(Guid draftId, List<Guid> draftUserIds, List<AthleteGroup> athleteGroups);
        Task SendAthleteGroupDraftedMessageAsync(Guid userId, List<Guid> draftUserIds, int group);
        Task SendMedalsManagedMessageAsync(Guid draftId, List<Guid> draftUserIds, ManageMedalsRequest data);
    }
}