namespace ProjectOlympia;

public class AssignUsersToDraftRequest
{
    public required Guid Id { get; set; }
    public required List<Guid> UserIds { get; set; }
}