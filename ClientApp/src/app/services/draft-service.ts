import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Draft } from '../models/draft';

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

}