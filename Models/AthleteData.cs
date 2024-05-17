namespace ProjectOlympia;

public class AthleteData
{
    public string Surname { get; set; }
    public string Forename { get; set; }
    public string Description { get; set; }
    public string Discipline { get; set; }
    public string Country { get; set; }
    public string CountryCode { get; set; }
    public string ISO { get; set; }

    public AthleteData(string Forename, string Surname, string Description, string Discipline, string Country, string CountryCode, string ISO)
    {
        this.Forename = Forename;
        this.Surname = Surname;
        this.Description = Description;
        this.Discipline = Discipline;
        this.Country = Country;
        this.CountryCode = CountryCode;
        this.ISO = ISO;
    }
}