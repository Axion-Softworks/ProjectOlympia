namespace ProjectOlympia;

public class AddMedalRequest
{
    public required string Event { get; set; }
    public required EPlace Place { get; set; }
    public required Guid AthleteId { get; set; }
}