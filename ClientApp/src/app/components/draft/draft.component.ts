import { Component, OnDestroy, } from '@angular/core';
import { Athlete } from 'src/app/models/athlete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AthleteCardComponent } from '../athlete-card/athlete-card.component';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion'; 
import { UserPanelComponent } from '../user-panel/user-panel.component';
import { ActivatedRoute } from '@angular/router';
import { DraftService } from 'src/app/services/draft-service';
import { Draft } from 'src/app/models/draft';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from 'src/app/services/user.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'draft',
  templateUrl: './draft.component.html',
  styleUrl: './draft.component.css',
  standalone: true,
  imports: [
    CommonModule,

    MatTooltipModule, 
    MatGridListModule,
    MatButtonToggleModule,
    MatExpansionModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ScrollingModule,

    AthleteCardComponent,
    UserPanelComponent
  ]
})
export class DraftComponent implements OnDestroy {
  // @HostListener('window:resize', ['$event.target.innerWidth'])
  // onResize(width: number) {
  //   if (width >= 1200) {
  //     this.rowHeight = "2:1";
  //   }
  //   else {
  //     this.rowHeight = "1:1";
  //   }
  // }

  private _unsubscribeAll: Subject<any> = new Subject();

  public draft?: Draft;
  public draftStarted: boolean = false;

  public rowHeight = "1:1";

  constructor(
    private route: ActivatedRoute,
    private draftService: DraftService,
    private userService: UserService,
    private webSocketService: WebSocketService
  ) {
    var draftId = this.route.snapshot.paramMap.get('id');

    if (!!draftId) {
      this.draftService.getDraft(draftId)
        .then((result: Draft) => {
          //console.log(this.draft)
          this.draft = result;
          this.draft?.users.forEach(user => {
            user.athletes = this.draft ? this.draft?.athletes.filter(f => f.userId == user.id) : [];
          });
        });
    }

    this.webSocketService.onAthleteDrafted.pipe(takeUntil(this._unsubscribeAll)).subscribe({
      next: (response) => {
        var user = this.draft?.users.find(x => x.id === response.userId);
        var athlete = this.draft?.athletes.find(x => x.id === response.athleteId);

        if (!athlete)
          return;

        user?.athletes.push(athlete);

        athlete.userId = response.userId;
      }
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  sortAthletes(sort: string): void {  
    if (!this.draft)
      return;

    switch (sort) {
      case "country":
          this.draft.athletes.sort((a, b) => {
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
        this.draft.athletes.sort((a, b) => {
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
        this.draft.athletes.sort((a, b) => {
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
    this.draft.athletes = [...this.draft.athletes];
  }

  getCurrentUserIndex(): number {
    if (!this.draft)
      return -1;

    var id = this.userService.getId();

    var index = this.draft.users.findIndex(f => f.id == id);

    return index;
  }

  onDraftPickEmitted(athlete: Athlete): void {
    if (!this.draft?.users)
        return;

    var userIndex = this.getCurrentUserIndex();

    var user = this.draft.users[userIndex];
    
    this.draftService.draftAthlete(user.id, athlete.id)
      .then(() => {
        user.athletes.push(athlete);
        athlete.userId = user.id;
      });
  }

  athleteIsDrafted(athlete: Athlete): boolean {
    var drafted = !!athlete.userId;

    return drafted;
  }

  userIsAdmin(): boolean {
    return this.userService.isAdmin();
  }

  startDraft(): void {
    this.draftStarted = true;
  }
}
