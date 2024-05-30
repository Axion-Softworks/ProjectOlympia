import { Injectable } from '@angular/core';
import { WebSocketService } from './services/web-socket.service';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(
    private _webSocketService: WebSocketService
  ) { }
}