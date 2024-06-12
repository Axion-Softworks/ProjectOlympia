namespace ProjectOlympia
{
    public class DraftRandomisedResponse
    {
        public Guid DraftId { get; set; }
        public required List<string> DraftOrder { get; set; }
    }
}