import { Injectable } from '@angular/core';
import { WebSocketService } from './services/web-socket.service';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(
    private _webSocketService: WebSocketService
  ) { }

  public loggedIn(): boolean { 
    let player;
    try { 
      player = JSON.parse(sessionStorage.getItem('player') as string); 
      if (!player.id)
        return false;
      if (!player.username)
        return false;
    }
    catch { return false; }
    return player != null; 
  }
}