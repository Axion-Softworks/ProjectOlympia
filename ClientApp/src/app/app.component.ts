import { Component } from '@angular/core';
import { WebSocketService } from './services/web-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'app';

  constructor(private webSocketService: WebSocketService) {
    //console.log("Is WS Connected: " + this.webSocketService.connected);
  }
}
