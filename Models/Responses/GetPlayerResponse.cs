namespace ProjectOlympia;

public class GetPlayerResponse
{
    public Guid Id { get; set;}
    public string Username { get; set; }
    public List<DraftData> Drafts{ get; set; } = new List<DraftData>();

    public GetPlayerResponse(Player player)
    {
        Id = player.Id;
        Username = player.Username;
    }
}