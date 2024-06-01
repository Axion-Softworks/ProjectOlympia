import { Inject, Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { DraftSummary } from '../models/draft-summary';
import { WebSocketService } from './web-socket.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public user?: User;

  constructor(
    private http: HttpClient,
    private webSocketService: WebSocketService,
    @Inject('BASE_URL') private baseUrl: string
  ) { }

  public login(formgroup: FormGroup): void {
    this.http.post<User>(this.baseUrl + 'api/login', formgroup.value).subscribe({
      next: (result) => {
        this.user = result; sessionStorage.setItem('user', JSON.stringify(result));

        this.webSocketService.authenticate(this.user.id);
      },
      error: (e) => console.error(e)
    });
  }

  public logOut(): void {
    sessionStorage.clear();
    this.user = undefined;
  }

  public loggedIn(): boolean { 
    let user;
    if (!this.user) {
      try { 
        user = JSON.parse(sessionStorage.getItem('user') as string);

        if (!user.id)
          return false;
        if (!user.username)
          return false;

        this.user = user;
      }
      catch { return false; }
    } else
      user = this.user;
    
    return user != null; 
  }

  public getUserDrafts(): DraftSummary[] {
    let user;

    if (!this.user) {
      try { 
        user = JSON.parse(sessionStorage.getItem('user') as string); 
        if (!user.drafts)
          return [];
        return user.drafts;
      }
      catch { return []; }
    } else 
      return this.user.drafts;
  }

  public isAdmin(): boolean {
    let admin;

    if (!this.user) {
      try { 
        let user = JSON.parse(sessionStorage.getItem('user') as string);

        if (!user.id)
          return false;
        if (!user.username)
          return false;

        admin = user.isAdmin;
      }
      catch { return false; }
    } else 
      admin = this.user.isAdmin;
    
    return admin; 
  }

  public getUsername(): string {
    let name;

    if (!this.user) {
      try { 
        let user = JSON.parse(sessionStorage.getItem('user') as string);

        name = user.username;
      }
      catch { return ""; }
    } else 
      name = this.user.username;
    
    return name; 
  }

  public getId(): string {
    let id;

    if (!this.user) {
      try { 
        let user = JSON.parse(sessionStorage.getItem('user') as string);

        id = user.id;
      }
      catch { return ""; }
    } else 
      id = this.user.id;
    
    return id; 
  }

}
