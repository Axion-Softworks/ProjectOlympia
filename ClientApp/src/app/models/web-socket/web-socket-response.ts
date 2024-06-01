import { EWebSocketOperation } from "./e-web-socket-operation";

export interface WebSocketResponse {
    operation: EWebSocketOperation;
    content: string;
}