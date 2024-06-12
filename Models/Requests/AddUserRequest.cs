namespace ProjectOlympia;

public class AddUserRequest
{
    public required string Username { get; set; }
    public required string Password { get; set; }
    public required bool IsAdmin { get; set; }
    public required string HexColor { get; set; }

    public AddUserRequest()
    {}
}