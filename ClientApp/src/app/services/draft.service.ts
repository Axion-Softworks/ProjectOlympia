import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Draft } from '../models/draft';
import { Athlete } from '../models/athlete';
import { DraftAthleteRequest } from '../models/requests/draft-athlete-request';
import { DraftSummary } from '../models/draft-summary';
import { EDraftStatus } from '../models/e-draft-status';
import { DraftAthleteGroupRequest } from '../models/requests/draft-athlete-group-request';
import { UserService } from './user.service';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class DraftService extends BaseService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string, private userService: UserService) { super() }

  public getDraft(id: string): Promise<Draft> {
    return new Promise((resolve) => {
      this.http.get<Draft>(this.baseUrl + 'api/draft/' + id, {
        headers: this.getAuthorization()
      })
      .subscribe({
        next: (result) => { resolve(result) }, 
        error: (e) => console.error(e)
      });
    })
  }

  public getDraftWithMedals(id: string): Promise<Draft> {
    return new Promise((resolve) => {
      this.http.get<Draft>(this.baseUrl + 'api/draft/' + id + '/leaderboard', {
        headers: this.getAuthorization()
      })
      .subscribe({
        next: (result) => { resolve(result) }, 
        error: (e) => console.error(e)
      });
    })
  }

  public draftAthlete(userId: string, athleteId: string): Promise<Athlete> {
    let request: DraftAthleteRequest = { userId: userId, id: athleteId }

    return new Promise((resolve, reject) => {
      this.http.put<Athlete>(this.baseUrl + 'api/athlete/assign', request, {
        headers: this.getAuthorization()
      })
      .subscribe({
        next: (result) => { resolve(result) }, 
        error: (e) => { console.error(e); reject(e) }
      });
    })
  }

  draftAthleteGroup(userId: string, draftId: string, group: number) {
    let request: DraftAthleteGroupRequest = { userId: userId, draftId: draftId, group: group }

    return new Promise((resolve, reject) => {
      this.http.put<any>(this.baseUrl + 'api/draft/assign-group', request, {
        headers: this.getAuthorization()
      })
      .subscribe({
        next: (result) => { resolve(result) }, 
        error: (e) => { console.error(e); reject(e) }
      });
    })
  }

  public getDraftSummariesByUserId(userId: string): Promise<DraftSummary[]> {
    return new Promise((resolve) => {
      this.http.get<DraftSummary[]>(this.baseUrl + 'api/draft/summary/' + userId, {
        headers: this.getAuthorization()
      })
      .subscribe({
        next: (result) => { resolve(result) }, 
        error: (e) => console.error(e)
      });
    })
  }

  public setDraftStatus(draftId: string, status: EDraftStatus): Promise<Draft> {
    return new Promise((resolve) => {
      this.http.put<Draft>(this.baseUrl + 'api/draft/status/' + draftId + '/' + status, null, {
        headers: this.getAuthorization()
      })
      .subscribe({
        next: (result) => { resolve(result) }, 
        error: (e) => console.error(e)
      });
    })
  }

  public randomiseDraft(draftId: string): Promise<any> {
    return new Promise((resolve) => {
      this.http.put<any>(this.baseUrl + 'api/draft/randomise/' + draftId, null, {
        headers: this.getAuthorization()
      })
      .subscribe({
        next: (result) => { resolve(result) }, 
        error: (e) => console.error(e)
      });
    })
  }

  public randomiseGroupDraft(draftId: string): Promise<any> {
    return new Promise((resolve) => {
      this.http.put<any>(this.baseUrl + 'api/draft/randomise-groups/' + draftId, null, {
        headers: this.getAuthorization()
      })
      .subscribe({
        next: (result) => { resolve(result) }, 
        error: (e) => console.error(e)
      });
    })
  }

}