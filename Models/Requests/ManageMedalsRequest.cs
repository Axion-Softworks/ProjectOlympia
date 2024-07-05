namespace ProjectOlympia;

public class ManageMedalsRequest
{
    public required Guid AthleteId { get; set;}
    public required List<MedalData> Medals { get; set; }
}