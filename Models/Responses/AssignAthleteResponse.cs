namespace ProjectOlympia;

public class AssignAthleteResponse
{
    public Guid Id { get; set; }
    public string Surname { get; set; }
    public string Forename { get; set; }
    public string Description { get; set; }
    public string Discipline { get; set; }
    public string Country { get; set; }
    public string CountryCode { get; set; }
    public string Iso { get; set; }
    public List<MedalData> Medals { get; set; } = new List<MedalData>();
    public PlayerData? Player { get; set; }
    public Guid? PlayerId { get; set; }

    public AssignAthleteResponse(Athlete athlete)
    {
        Id = athlete.Id;
        Forename = athlete.Forename;
        Surname = athlete.Surname;
        Country = athlete.Country;
        CountryCode = athlete.CountryCode;
        Iso = athlete.Iso;
        Description = athlete.Description;
        Discipline = athlete.Discipline;
        PlayerId = athlete.PlayerId;
    }
}