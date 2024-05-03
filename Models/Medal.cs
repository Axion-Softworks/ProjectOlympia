namespace ProjectOlympia;

public class Medal
{
    public Guid Id { get; set; }

    public string Event { get; set; }

    public EPlace Place { get; set; }
    
    public Medal(string Event, EPlace place)
    {
        this.Event = Event;
        Place = place;
    }
}