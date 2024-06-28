namespace ProjectOlympia;

public class DraftAthleteGroupRequest
{
    public required Guid UserId { get; set; }
    public required Guid DraftId { get; set; }
    public required int Group { get; set; }
}