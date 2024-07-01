namespace ProjectOlympia
{
    public class GroupDraftRandomisedResponse
    {
        public Guid DraftId { get; set; }
        public required List<AthleteGroup> AthleteGroups { get; set; }
    }
}