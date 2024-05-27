namespace ProjectOlympia;

public class AddDraftRequest
{
    public required string Name { get; set; }
    public required List<Guid> PlayerIds { get; set; }
}