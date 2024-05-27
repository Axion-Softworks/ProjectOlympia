namespace ProjectOlympia;

public class UpdatePlayerRequest
{
    public Guid Id { get; set;}
    public required string Username { get; set; }
    public required string Password { get; set; }
    public required List<Draft> Drafts{ get; set; }

    public UpdatePlayerRequest()
    {}
}