namespace ProjectOlympia
{
    public class WebSocketRequest
    {
        public Guid UserId { get; set; }
        public EWebSocketOperation Operation { get; set; }
        public string Content { get; set; } = string.Empty;
    }
}