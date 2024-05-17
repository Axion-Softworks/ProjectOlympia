namespace ProjectOlympia;

public class Athlete
{
    public Guid Id { get; set; }
    public string Surname { get; set; }
    public string Forename { get; set; }
    public string Description { get; set; }
    public string Discipline { get; set; }
    public string Country { get; set; }
    public string CountryCode { get; set; }
    public string Iso { get; set; }
    public List<Medal> Medals { get; set; }
    public Player? Player { get; set; }
    public Guid? PlayerId { get; set; }
    public Draft Draft { get; set; }

    public Athlete() {}
    public Athlete(string forename, string surname, string description, string discipline, string country, string countryCode, string iso, List<Medal> medals, Draft draft)
    {
        this.Forename = forename;
        this.Surname = surname;
        this.Description = description;
        this.Discipline = discipline;
        this.Country = country;
        this.CountryCode = countryCode;
        this.Iso = iso;
        this.Medals = medals;
        this.Draft = draft;
    }
}