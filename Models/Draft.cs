namespace ProjectOlympia;

public class Draft
{
    public required Guid Id { get; set; }
    public required string Name { get; set; }
    public required List<User> Users { get; set; }
    public required List<Athlete> Athletes { get; set; }
    public required EDraftStatus Status { get; set; }
    public required string DraftOrder { get; set;}

    public Draft()
    {}
}