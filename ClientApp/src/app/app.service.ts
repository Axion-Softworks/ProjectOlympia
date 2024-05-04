import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor() { }

  public loggedIn(): boolean { 
    let user;
    try { 
      user = JSON.parse(sessionStorage.getItem('user') as string); 
      if (!user.id)
        return false;
      if (!user.name)
        return false;
    }
    catch { return false; }
    return user != null; 
  }
}