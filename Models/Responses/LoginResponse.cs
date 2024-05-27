namespace ProjectOlympia;

public class LoginResponse
{
    public Guid Id { get; set;}
    public string Username { get; set; }
    public List<Draft> Drafts{ get; set; } = new List<Draft>();

    public LoginResponse(Player player)
    {
        Id = player.Id;
        Username = player.Username;
        Drafts = player.Drafts;
    }
}