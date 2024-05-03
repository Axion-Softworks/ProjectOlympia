import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Athlete } from 'src/app/models/athlete';
import { EPlace } from '../../models/e-place';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html',
})
export class FetchDataComponent {
  public athletes: Athlete[] = [];
  public ePlace = EPlace;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    http.get<Athlete[]>(baseUrl + 'api/athlete').subscribe(result => {
      this.athletes = result;
    }, error => console.error(error));
  }

  getMedals(athlete: Athlete, place: EPlace) : number {
    return athlete.medals.filter(medal => medal.place == place).length;
  }

  getMedalOverlay(athlete: Athlete, place: EPlace): string {
    //not yet used in html, no super fast tooltip options without a UI framework :P
    var medals = athlete.medals.filter(medal => medal.place == place);

    if (medals.length < 1)
      return "";

    return medals.map(medal => medal.event).join(", ");
  }
}
