namespace ProjectOlympia;

public class LoginResponse
{
    public Guid Id { get; set;}
    public string Username { get; set; }
    public bool IsAdmin { get; set; }

    public LoginResponse(User user)
    {
        Id = user.Id;
        Username = user.Username;
        IsAdmin = user.IsAdmin;
    }
}