namespace ProjectOlympia;

public class User
{
    public Guid Id { get; set; }

    public string Name { get; set; }
    
    public User(string name)
    {
        this.Name = name;
    }
}