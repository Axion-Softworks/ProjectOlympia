namespace ProjectOlympia;

public class Medal
{
    public Guid Id { get; set; }
    public string Event { get; set; }
    public EPlace Place { get; set; }
    public Athlete Athlete { get; set; }

    public Medal(){}
    public Medal(string Event, EPlace place, Athlete athlete)
    {
        this.Event = Event;
        Place = place;
        this.Athlete = athlete;
    }
}