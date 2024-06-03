namespace ProjectOlympia
{
    public interface IWebSocketService
    {
        Task SendAthleteAssignedMessageAsync(Guid userId, Guid athleteId, List<Guid> draftUserIds);
    }
}