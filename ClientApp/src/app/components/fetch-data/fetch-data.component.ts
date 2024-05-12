import { Component, HostListener, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Athlete } from 'src/app/models/athlete';
import { EPlace } from '../../models/e-place';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AthleteCardComponent } from '../athlete-card/athlete-card.component';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Player } from 'src/app/models/player';
import { MatExpansionModule } from '@angular/material/expansion';
import { PlayerPanelComponent } from '../player-panel/player-panel.component';
import * as _ from 'lodash'; 

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html',
  styleUrl: './fetch-data.component.css',
  standalone: true,
  imports: [
    CommonModule,

    MatTooltipModule, 
    MatGridListModule,
    MatButtonToggleModule,
    MatExpansionModule,

    AthleteCardComponent,
    PlayerPanelComponent
  ]
})
export class FetchDataComponent {
  // @HostListener('window:resize', ['$event.target.innerWidth'])
  // onResize(width: number) {
  //   if (width >= 1200) {
  //     this.rowHeight = "2:1";
  //   }
  //   else {
  //     this.rowHeight = "1:1";
  //   }
  // }

  public athletes: Athlete[] = [];
  public ePlace = EPlace;
  public players: Player[] = [{id: '0', name: 'Kyle', athletes: []}, {id: '1', name: 'Emily', athletes: []}];

  public rowHeight = "1:1";

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    http.post<Athlete[]>(baseUrl + 'api/data', {"filename": "ExampleData(Complete).csv"}).subscribe(result => {
      this.athletes = result;

      var test = 2;

      this.players.forEach((player) => {
        var i = 0;
        while (i <= test) {
          if (i == 0) {
            var ath = this.athletes.find(f => f.forename == "Sharon"); //long name test
            if (ath)
              player.athletes.push(ath);

            i++;
            continue;
          }
              

          var random = _.sample(this.athletes);
          if (random)
          player.athletes.push(random);

          i++;
        }
      })
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

  sortAthletes(sort: string): void {  
    switch (sort) {
      case "country":
          this.athletes.sort((a, b) => {
            if ( a.country < b.country ){
            return -1;
            }
            if ( a.country > b.country ){
              return 1;
            }
            return 0;
          });
    
        break;
    
      case "discipline":
        this.athletes.sort((a, b) => {
          if ( a.discipline < b.discipline ){
          return -1;
          }
          if ( a.discipline > b.discipline ){
            return 1;
          }
          return 0;
        });
    
        break;

      case "name":
        this.athletes.sort((a, b) => {
          if ( a.surname < b.surname ){
          return -1;
          }
          if ( a.surname > b.surname ){
            return 1;
          }
          return 0;
        });
    
        break;

      default:
        break;
    }

  }
}
