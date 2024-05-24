import { Inject, Injectable } from "@angular/core";

// Move this into the app service for simplicity??

@Injectable({
    providedIn: "root"
})
export class WebSocketService {
    private readonly webSocket: WebSocket;

    public get connected(): boolean {
        if (!this.webSocket)
            return false;

        const result: boolean = this.webSocket.readyState === this.webSocket.OPEN;

        return result;
    }

    constructor(
        @Inject("BASE_URL") baseUrl: string
    ) {
        this.webSocket = new WebSocket(baseUrl + "ws");

        this.webSocket.onerror = (ev: Event) => {
            this.log("Web Socket error", ev);
        };

        this.webSocket.onopen = (ev: Event) => {
            this.log("Web Socket open", ev);
        };

        this.webSocket.onclose = (ev: CloseEvent) => {
            this.log("Web Socket close", ev);
        };

        this.webSocket.onmessage = (ev: MessageEvent) => {
            this.log("Web Socket message", ev);
        };
    }

    public send(value: any): void {
        if (!value)
            return;

        let json: string;

        if (value instanceof String) {
            json = value.toString();
        }
        else {
            json = JSON.stringify(value);
        }

        this.webSocket.send(json);
    }

    private log(message: string, value: any = null) {
        if (!value) {
            console.log(`[${new Date().toISOString()}] ${message}`);
        }
        else {
            console.log(`[${new Date().toISOString()}] ${message}`, value);
        }
    }
}