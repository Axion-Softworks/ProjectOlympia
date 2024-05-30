import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Draft } from '../models/draft';
import { Athlete } from '../models/athlete';
import { DraftAthleteRequest } from '../models/requests/draft-athlete-request';

@Injectable({
  providedIn: 'root'
})
export class DraftService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  public getDraft(id: string): Promise<Draft> {
    return new Promise((resolve) => {
      this.http.get<Draft>(this.baseUrl + 'api/draft/' + id)
      .subscribe({
        next: (result) => { console.log(result); resolve(result) }, 
        error: (e) => console.error(e)
      });
    })
  }

  public draftAthlete(userId: string, athleteId: string): Promise<Athlete> {
    let request: DraftAthleteRequest = { userId: userId, id: athleteId }

    return new Promise((resolve) => {
      this.http.put<Athlete>(this.baseUrl + 'api/athlete/assign', request)
      .subscribe({
        next: (result) => { console.log(result); resolve(result) }, 
        error: (e) => console.error(e)
      });
    })
  }

}