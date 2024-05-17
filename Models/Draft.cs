namespace ProjectOlympia;

public class Draft
{
    public required Guid Id { get; set; }
    public required string Name { get; set; }
    public required List<Player> Players { get; set; }
    public required List<Athlete> Athletes { get; set; }

    public Draft()
    {
        
    }
}