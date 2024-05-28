namespace ProjectOlympia;

public class GetUserResponse
{
    public Guid Id { get; set;}
    public string Username { get; set; }
    public List<DraftData> Drafts{ get; set; } = new List<DraftData>();

    public GetUserResponse(User user)
    {
        Id = user.Id;
        Username = user.Username;
    }
}