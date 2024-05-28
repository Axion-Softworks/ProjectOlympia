namespace ProjectOlympia;

public class AddDraftResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public List<string> Users { get; set; }

    public AddDraftResponse(Draft draft)
    {
        Id = draft.Id;
        Name = draft.Name;
        Users = draft.Users.Select(s => s.Username).ToList();
    }
}