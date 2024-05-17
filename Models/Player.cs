namespace ProjectOlympia;

public class Player
{
    public Guid Id { get; set;}
    public required string Username { get; set; }
    public required string Password { get; set; }
    public required List<Draft> Drafts{ get; set; } = new List<Draft>();

    public Player()
    {}
}