namespace ProjectOlympia;

public class Athlete
{
    public Guid Id { get; set; }
    public required string Surname { get; set; }
    public required string Forename { get; set; }
    public required string Description { get; set; }
    public required string Discipline { get; set; }
    public required string Country { get; set; }
    public required string CountryCode { get; set; }
    public required string Iso { get; set; }
    public required List<Medal> Medals { get; set; }
    public User? User { get; set; }
    public Guid? UserId { get; set; }
    public required Draft Draft { get; set; }
    public required int Group { get; set; } = -1;

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