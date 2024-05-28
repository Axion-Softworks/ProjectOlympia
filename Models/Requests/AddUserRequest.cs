namespace ProjectOlympia;

public class AddUserRequest
{
    public required string Username { get; set; }
    public required string Password { get; set; }

    public AddUserRequest()
    {}
}