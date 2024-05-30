import { Inject, Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { DraftSummary } from '../models/draft-summary';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public user?: User;

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  public login(formgroup: FormGroup): void {
    this.http.post<User>(this.baseUrl + 'api/login', formgroup.value).subscribe({
      next: (result) => { this.user = result; sessionStorage.setItem('user', JSON.stringify(result)); },
      error: (e) => console.error(e)
    });
  }

  public loggedIn(): boolean { 
    let user;
    try { 
      user = JSON.parse(sessionStorage.getItem('user') as string);

      if (!user.id)
        return false;
      if (!user.username)
        return false;

      this.user = user;
    }
    catch { return false; }
    return user != null; 
  }

  public getUserDrafts(): DraftSummary[] {
    let user;

    try { 
      user = JSON.parse(sessionStorage.getItem('user') as string); 
      if (!user.drafts)
        return [];
      return user.drafts;
    }
    catch { return []; }
  }

  public isAdmin(): boolean {
    let admin;
    try { 
      let user = JSON.parse(sessionStorage.getItem('user') as string);

      if (!user.id)
        return false;
      if (!user.username)
        return false;

      admin = user.isAdmin;
    }
    catch { return false; }
    return admin; 
  }

}
