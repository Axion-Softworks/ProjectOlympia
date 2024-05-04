import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-counter-component',
  templateUrl: './counter.component.html'
})
export class CounterComponent {
  public currentCount = 0;
  public webSocketConnected: boolean = false;

  private webSocket: WebSocket;

  constructor(@Inject("BASE_URL") baseUrl: string) {
    this.webSocket = new WebSocket(`${baseUrl}ws`);

    this.webSocket.onerror = (ev: Event) => {
      this.log("Web Socket error", ev);
    };

    this.webSocket.onopen = (ev: Event) => {
      this.log("Web Socket open", ev);

      this.webSocketConnected = true;
    };

    this.webSocket.onclose = (ev: Event) => {
      this.log("Web Socket close", ev);

      this.webSocketConnected = false;
    };

    this.webSocket.onmessage = (ev: Event) => {
      this.log("Web Socket message", ev);
    };
  }

  public incrementCounter() {
    this.currentCount++;
  }

  public test(): void {
    if (this.webSocketConnected === false)
      return;

    const obj = {
      prop: "test",
      prop1: {
        x: "test1"
      },
      prop2: [
        "test2",
        "test3",
        "test4"
      ]
    };

    const json: string = JSON.stringify(obj);

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
