namespace ProjectOlympia;

public class UpdatePlayerRequest
{
    public required Guid Id { get; set;}
    public required string Username { get; set; }
    public required string Password { get; set; }
}