import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Draft } from '../models/draft';
import { Athlete } from '../models/athlete';
import { DraftAthleteRequest } from '../models/requests/draft-athlete-request';
import { DraftSummary } from '../models/draft-summary';
import { EDraftStatus } from '../models/e-draft-status';
import { DraftAthleteGroupRequest } from '../models/requests/draft-athlete-group-request';

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

    return new Promise((resolve, reject) => {
      this.http.put<Athlete>(this.baseUrl + 'api/athlete/assign', request)
      .subscribe({
        next: (result) => { resolve(result) }, 
        error: (e) => { console.error(e); reject(e) }
      });
    })
  }

  draftAthleteGroup(userId: string, draftId: string, group: number) {
    let request: DraftAthleteGroupRequest = { userId: userId, draftId: draftId, group: group }

    return new Promise((resolve, reject) => {
      this.http.put<any>(this.baseUrl + 'api/draft/assign-group', request)
      .subscribe({
        next: (result) => { resolve(result) }, 
        error: (e) => { console.error(e); reject(e) }
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

  public randomiseDraft(draftId: string): Promise<any> {
    return new Promise((resolve) => {
      this.http.put<any>(this.baseUrl + 'api/draft/randomise/' + draftId, null)
      .subscribe({
        next: (result) => { resolve(result) }, 
        error: (e) => console.error(e)
      });
    })
  }

  public randomiseGroupDraft(draftId: string): Promise<any> {
    return new Promise((resolve) => {
      this.http.put<any>(this.baseUrl + 'api/draft/randomise-groups/' + draftId, null)
      .subscribe({
        next: (result) => { resolve(result) }, 
        error: (e) => console.error(e)
      });
    })
  }

}