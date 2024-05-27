namespace ProjectOlympia;

public class AddPlayerRequest
{
    public required string Username { get; set; }
    public required string Password { get; set; }

    public AddPlayerRequest()
    {}
}