namespace ProjectOlympia;

public class Athlete
{

    public Guid Id { get; set; }

    public string Name { get; set; }

    public string Description { get; set; }

    public string Discipline { get; set; }
    
    public string Country { get; set; }

    public List<Medal> Medals { get; set; }

    public Athlete(string name, string description, string discipline, string country, List<Medal> medals)
    {
        Name = name;
        Description = description;
        Discipline = discipline;
        Country = country;
        Medals = medals;
    }
}