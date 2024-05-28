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
    let user;
    try { 
      user = JSON.parse(sessionStorage.getItem('user') as string); 
      if (!user.id)
        return false;
      if (!user.username)
        return false;
    }
    catch { return false; }
    return user != null; 
  }
}