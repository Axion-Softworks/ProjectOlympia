namespace ProjectOlympia;

public class AddDraftRequest
{
    public required string Name { get; set; }
    public required List<Guid> UserIds { get; set; }
}