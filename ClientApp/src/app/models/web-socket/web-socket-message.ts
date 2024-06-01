import { EWebSocketOperation } from "./e-web-socket-operation";

export interface WebSocketMessage {
    userId: string;
    operation: EWebSocketOperation;
    content?: string;
}