namespace ProjectOlympia;

public class LoginResponse
{
    public Guid Id { get; set;}
    public string Username { get; set; }
    public List<Draft> Drafts{ get; set; } = new List<Draft>();

    public LoginResponse(User user)
    {
        Id = user.Id;
        Username = user.Username;
        Drafts = user.Drafts;
    }
}