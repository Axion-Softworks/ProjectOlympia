namespace ProjectOlympia;

public class AddMedalResponse
{
    public Guid Id { get; set; }
    public string Event { get; set; }
    public EPlace Place { get; set; }
    public string Athlete { get; set; }

    public AddMedalResponse(Medal medal)
    {
        Id = medal.Id;
        Event = medal.Event;
        Place = medal.Place;
        Athlete = $"{medal.Athlete.Forename} {medal.Athlete.Surname}";
    }
}