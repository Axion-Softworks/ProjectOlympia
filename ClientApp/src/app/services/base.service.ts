import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  constructor() { }

  getAuthorization(): any {
    return {
        Authorization: "Bearer " + this.getJwt()
     }
  }

  public getJwt(): string {
    let jwt;

    try { 
      let user = JSON.parse(sessionStorage.getItem('user') as string);

      jwt = user.jwt;
    }
    catch { return ""; }
    
    return jwt; 
  }
}
