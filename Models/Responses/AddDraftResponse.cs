namespace ProjectOlympia;

public class AddDraftResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public List<string> Players { get; set; }

    public AddDraftResponse(Draft draft)
    {
        Id = draft.Id;
        Name = draft.Name;
        Players = draft.Players.Select(s => s.Username).ToList();
    }
}