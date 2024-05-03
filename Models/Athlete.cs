namespace ProjectOlympia;

public class Athlete
{

    public Guid Id { get; set; }

    public string Name { get; set; }

    public string Description { get; set; }

    public List<Medal> Medals { get; set; }

    public Athlete(string name, string description, List<Medal> medals)
    {
        Name = name;
        Description = description;
        Medals = medals;
    }
}