import { Inject, Injectable } from "@angular/core";
import { WebSocketMessage } from "../models/web-socket/web-socket-message";
import { EWebSocketOperation } from "../models/web-socket/e-web-socket-operation";
import { WebSocketResponse } from "../models/web-socket/web-socket-response";
import { AthleteDraftedResponse } from "../models/web-socket/athlete-drafted-response";
import { Subject } from "rxjs";
import { DraftStartedResponse } from "../models/web-socket/draft-started-response";
import { DraftRandomisedResponse } from "../models/web-socket/draft-randomised-response";
import { UserService } from "./user.service";

@Injectable({
    providedIn: "root"
})
export class WebSocketService {
    private readonly webSocket: WebSocket;

    public get connected(): boolean {
        if (!this.webSocket)
            return false;

        const result: boolean = this.webSocket.readyState === WebSocket.OPEN;

        return result;
    }

    public readonly onAthleteDrafted: Subject<AthleteDraftedResponse> = new Subject();
    public readonly onDraftStarted: Subject<DraftStartedResponse> = new Subject();
    public readonly onDraftRandomised: Subject<DraftRandomisedResponse> = new Subject();

    constructor(
        @Inject("BASE_URL") baseUrl: string,
        private userService: UserService
    ) {
        this.userService.onLoggedIn.subscribe({
            next: (id: string) => { this.authenticate(id) }
        })

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

        this.webSocket.onmessage = (ev: MessageEvent) => { this.onMessage(ev); }
    }

    public authenticate(userId: string): void {
        const message: WebSocketMessage = {
            userId: userId,
            operation: EWebSocketOperation.Auth
        };

        console.log("Web Socket auth")

        this.send(message);
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

    private onMessage(event: MessageEvent) {
        this.log("Web Socket message", event);

        const response: WebSocketResponse = JSON.parse(event.data);

        switch (response.operation) {
            case EWebSocketOperation.AthleteDrafted:
                const athleteResponse: AthleteDraftedResponse = JSON.parse(response.content);

                this.onAthleteDrafted.next(athleteResponse);

                break;
        
            case EWebSocketOperation.DraftStarted:
                const draftStartedResponse: DraftStartedResponse = JSON.parse(response.content);

                this.onDraftStarted.next(draftStartedResponse);
                break;

            case EWebSocketOperation.DraftRandomised:
                const draftRandomisedResponse: DraftRandomisedResponse = JSON.parse(response.content);

                this.onDraftRandomised.next(draftRandomisedResponse);
                break;

            default:
                break;
        }
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