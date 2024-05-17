import { Component } from '@angular/core';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-counter-component',
  templateUrl: './counter.component.html'
})
export class CounterComponent {
  public currentCount = 0;
  public get webSocketConnected(): boolean {
    return this.webSocket.connected;
  }

  constructor(private webSocket: WebSocketService) {
    this.webSocket.send("TEST");
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
}
