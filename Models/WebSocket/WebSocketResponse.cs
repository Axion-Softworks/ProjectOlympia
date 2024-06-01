namespace ProjectOlympia
{
    public class WebSocketResponse
    {
        public EWebSocketOperation Operation { get; set; }
        public string Content { get; set; } = string.Empty;
    }
}