namespace ProjectOlympia;

public class Medal
{
    public Guid Id { get; set; }
    public required string Event { get; set; }
    public required EPlace Place { get; set; }
    public required Athlete Athlete { get; set; }

    public Medal(){}
    public Medal(string Event, EPlace place, Athlete athlete)
    {
        this.Event = Event;
        Place = place;
        this.Athlete = athlete;
    }
}