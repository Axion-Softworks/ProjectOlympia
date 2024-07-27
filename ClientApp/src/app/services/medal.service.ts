import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AthleteMedalData } from '../models/athlete-medal-data';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class MedalService extends BaseService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { super() }

  public manageMedalsByAthleteId(athleteMedalData: AthleteMedalData): Promise<any> {
    return new Promise((resolve) => {
      this.http.put<any>(this.baseUrl + 'api/medal/manage', athleteMedalData, {
        headers: this.getAuthorization()
      })
      .subscribe({
        next: (result) => { resolve(result) }, 
        error: (e) => console.error(e)
      });
    });
  }

  public getMedalData(draftId: string): Promise<any> {
    return new Promise((resolve) => {
      this.http.get<any>(this.baseUrl + 'api/medal/update/' + draftId,
        { headers: this.getAuthorization() }
      )
      .subscribe({
        next: (result) => { resolve(result) }, 
        error: (e) => console.error(e)
      });
    })
  }

}