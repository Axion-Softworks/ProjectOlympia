namespace ProjectOlympia;

public class OlympicData
{
    public required string Code { get; set; }
    public required int MedalsGold { get; set; }
    public required int MedalsSilver { get; set; }
    public required int MedalsBronze { get; set; }
    public required List<OlympicMedal> Medals { get; set; }
}