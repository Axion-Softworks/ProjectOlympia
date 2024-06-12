namespace ProjectOlympia;

public class User
{
    public Guid Id { get; set;}
    public required string Username { get; set; }
    public required string Password { get; set; }
    public required List<Draft> Drafts{ get; set; } = new List<Draft>();
    public bool IsAdmin { get; set; }
    public string HexColor { get; set; }

    public User()
    {}
}