import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AthleteMedalData } from '../models/athlete-medal-data';

@Injectable({
  providedIn: 'root'
})
export class MedalService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  public manageMedalsByAthleteId(athleteMedalData: AthleteMedalData): Promise<any> {
    return new Promise((resolve) => {
      this.http.put<any>(this.baseUrl + 'api/medal/manage', athleteMedalData)
      .subscribe({
        next: (result) => { resolve(result) }, 
        error: (e) => console.error(e)
      });
    })
  }

}