namespace ProjectOlympia;

public class DraftSummaryData: DraftData
{
    public required int UserCount { get; set; }
    public required int AthleteCount { get; set; }
    public required EDraftStatus Status { get; set; }
}