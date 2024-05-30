namespace ProjectOlympia;

public class UpdateUserRequest
{
    public required Guid Id { get; set;}
    public required string Username { get; set; }
    public required string Password { get; set; }
    public required bool IsAdmin { get; set; }
}