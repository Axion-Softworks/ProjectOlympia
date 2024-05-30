namespace ProjectOlympia;

public class LoginResponse
{
    public Guid Id { get; set;}
    public string Username { get; set; }
    public List<DraftSummaryData> Drafts{ get; set; } = new List<DraftSummaryData>();

    public LoginResponse(User user)
    {
        Id = user.Id;
        Username = user.Username;
    }
}