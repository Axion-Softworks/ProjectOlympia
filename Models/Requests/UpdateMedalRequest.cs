namespace ProjectOlympia;

public class UpdateMedalRequest
{
    public required Guid Id { get; set; }
    public required string Event { get; set; }
    public required EPlace Place { get; set; }
    public required Athlete Athlete { get; set; }
}