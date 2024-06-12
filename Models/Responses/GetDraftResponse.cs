namespace ProjectOlympia;

public class GetDraftResponse
{
    public Guid Id { get; set;}
    public string Name { get; set; }
    public List<UserData> Users { get; set; } = new List<UserData>();
    public List<AthleteData> Athletes { get; set; } = new List<AthleteData>();
    public EDraftStatus Status { get; set; }
    public List<string> DraftOrder { get; set; }

    public GetDraftResponse(Draft draft)
    {
        Id = draft.Id;
        Name = draft.Name;
        Status = draft.Status;
        DraftOrder = draft.DraftOrder.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList();
    }
}