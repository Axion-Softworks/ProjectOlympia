namespace ProjectOlympia;

public class AthleteData
{
    public Guid Id { get; set; }
    public required string Surname { get; set; }
    public required string Forename { get; set; }
    public required string Description { get; set; }
    public required string Discipline { get; set; }
    public required string Country { get; set; }
    public required string CountryCode { get; set; }
    public required string Iso { get; set; }
    public required List<MedalData> Medals { get; set; } = new List<MedalData>();
    public Guid? UserId { get; set; }
}