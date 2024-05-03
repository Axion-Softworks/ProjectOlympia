namespace ProjectOlympia;

public class Medal
{
    public Guid Id { get; set; }

    public string Discipline { get; set; }

    public EPlace Place { get; set; }
    
    public Medal(string discipline, EPlace place)
    {
        Discipline = discipline;
        Place = place;
    }
}