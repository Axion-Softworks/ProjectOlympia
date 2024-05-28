namespace ProjectOlympia;

public class GetMedalResponse
{
    public Guid Id { get; set; }
    public string Event { get; set; }
    public EPlace Place { get; set; }
    public AthleteData? Athlete { get; set; }

    public GetMedalResponse(Medal medal)
    {
        Id = medal.Id;
        Event = medal.Event;
        Place = medal.Place;
    }
}