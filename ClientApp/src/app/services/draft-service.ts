import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Draft } from '../models/draft';
import { Athlete } from '../models/athlete';
import { DraftAthleteRequest } from '../models/requests/draft-athlete-request';
import { DraftSummary } from '../models/draft-summary';
import { EDraftStatus } from '../models/e-draft-status';

@Injectable({
  providedIn: 'root'
})
export class DraftService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  public getDraft(id: string): Promise<Draft> {
    return new Promise((resolve) => {
      this.http.get<Draft>(this.baseUrl + 'api/draft/' + id)
      .subscribe({
        next: (result) => { resolve(result) }, 
        error: (e) => console.error(e)
      });
    })
  }

  public draftAthlete(userId: string, athleteId: string): Promise<Athlete> {
    let request: DraftAthleteRequest = { userId: userId, id: athleteId }

    return new Promise((resolve) => {
      this.http.put<Athlete>(this.baseUrl + 'api/athlete/assign', request)
      .subscribe({
        next: (result) => { resolve(result) }, 
        error: (e) => console.error(e)
      });
    })
  }

  public getDraftSummariesByUserId(userId: string): Promise<DraftSummary[]> {
    return new Promise((resolve) => {
      this.http.get<DraftSummary[]>(this.baseUrl + 'api/draft/summary/' + userId)
      .subscribe({
        next: (result) => { resolve(result) }, 
        error: (e) => console.error(e)
      });
    })
  }

  public setDraftStatus(draftId: string, status: EDraftStatus): Promise<Draft> {
    return new Promise((resolve) => {
      this.http.put<Draft>(this.baseUrl + 'api/draft/status/' + draftId + '/' + status, null)
      .subscribe({
        next: (result) => { resolve(result) }, 
        error: (e) => console.error(e)
      });
    })
  }

}