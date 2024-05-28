namespace ProjectOlympia;

public class AssignPlayersToDraftRequest
{
    public required Guid Id { get; set; }
    public required List<Guid> PlayerIds { get; set; }
}