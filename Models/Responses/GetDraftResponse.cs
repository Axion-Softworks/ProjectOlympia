namespace ProjectOlympia;

public class GetDraftResponse
{
    public Guid Id { get; set;}
    public string Name { get; set; }
    public List<PlayerData> Players{ get; set; } = new List<PlayerData>();

    public GetDraftResponse(Draft draft)
    {
        Id = draft.Id;
        Name = draft.Name;
    }
}