import { Component, HostListener, OnDestroy, } from '@angular/core';
import { Athlete } from 'src/app/models/athlete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AthleteCardComponent } from '../athlete-card/athlete-card.component';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion'; 
import { UserPanelComponent } from '../user-panel/user-panel.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DraftService } from 'src/app/services/draft.service';
import { Draft } from 'src/app/models/draft';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from 'src/app/services/user.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { Subject, takeUntil } from 'rxjs';
import { EDraftStatus } from 'src/app/models/e-draft-status';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DraftedUserData } from 'src/app/models/drafted-user-data';
import { User } from 'src/app/models/user';
import { MatDialog } from '@angular/material/dialog';
import { GenericConfirmDialogComponent } from '../generic-confirm-dialog/generic-confirm-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { OutOfSyncDialogComponent } from './out-of-sync-dialog/out-of-sync-dialog.component';
import { GroupDraftRandomisedResponse } from 'src/app/models/web-socket/group-draft-randomised-response';
import { DraftGroup } from 'src/app/models/draft-group';
import { AthleteGroupCardComponent } from '../athlete-group-card/athlete-group-card.component';
import { AthleteGroupDraftedResponse } from 'src/app/models/web-socket/athlete-group-drafted-response';
import { DraftStatusResponse } from 'src/app/models/web-socket/draft-status-response';

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
    MatSnackBarModule,

    AthleteCardComponent,
    AthleteGroupCardComponent,
    UserPanelComponent
  ]
})
export class DraftComponent implements OnDestroy {
  @HostListener('window:resize', ['$event.target.innerWidth'])
  onResize(width: number) {
    this.setSizing(width);
  }

  private _unsubscribeAll: Subject<any> = new Subject();

  public draft?: Draft;

  public currentRoundPick: number = 0;
  public currentRound: number = 0;
  public totalRounds: number = 0;
  public currentTurnUser?: User;
  public orderedUsers: User[] = [];
  public picksRemaining: number = 0;

  public draftGroups: DraftGroup[] = [];

  public rowHeight = "1:1";
  public cols: number = 5;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private draftService: DraftService,
    private userService: UserService,
    private webSocketService: WebSocketService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.setSizing(window.innerWidth);
    
    var draftId = this.route.snapshot.paramMap.get('id');

    if (!!draftId) {
      this.draftService.getDraft(draftId)
        .then((result: Draft) => {
          this.draft = result;
          //console.log(this.draft)

          this.draft?.users.forEach(user => {
            user.athletes = this.draft ? this.draft?.athletes.filter(f => f.userId == user.id) : [];
          });

          if (!!this.draft.draftOrder && this.draft.draftOrder.length > 0) {
            this.draft.draftOrder.forEach(id => {
              var user = this.draft?.users.find(f => f.id == id);
              
              if (user)
                this.orderedUsers.push(user);
            });
          }

          this.calculateDraftData();

          if (this.draft.status == EDraftStatus.groupDraft) {
            this.sortDraftGroups()
            this.calculateGroupDraftData()
          }
            
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
        this.snackBar.open(`${user?.username} drafted ${athlete.forename} ${athlete.surname}`, "DRAFTED", { duration: 5000 });

        this.calculateDraftData();
      }
    });

    this.webSocketService.onDraftStatusChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe({
      next: (response: DraftStatusResponse) => {
        //console.log("Status change", response)
        if (this.draft && this.draft.id == response.draftId) {
          this.draft.status = response.status;

          switch (response.status) {
            case EDraftStatus.individualDraft:
              this.snackBar.open("The draft has begun!", "START", { duration: 5000 })
              
              this.calculateDraftData();
              break;

            case EDraftStatus.intermediate:
              this.snackBar.open("The first stage draft is complete!", "STANDBY", { duration: 5000 })
              break;

            case EDraftStatus.groupDraft:
              this.snackBar.open("The group draft has begun!", "START", { duration: 5000 })

              if (this.draftGroups.length < 1) {
                this.sortDraftGroups();
              }

              this.calculateGroupDraftData();
              break;

            case EDraftStatus.closed:
              this.snackBar.open("Drafting is complete!", "END", { duration: 5000 });

              this.router.navigate(["/leaderboard", this.draft.id])
              break;
          
            default:
              break;
          }
        }
      }
    });

    this.webSocketService.onDraftRandomised.pipe(takeUntil(this._unsubscribeAll)).subscribe({
      next: (response) => {
        if (this.draft && this.draft.id == response.draftId) {

          this.draft.draftOrder = response.draftOrder;

          this.orderedUsers = [];

          this.draft.draftOrder.forEach(id => {
            var user = this.draft?.users.find(f => f.id == id);
          
            if (!!user)
              this.orderedUsers.push(user);
          });

          this.snackBar.open("The draft order has been randomised!", "RANDOM", { duration: 5000 })
        }
      }
    });

    this.webSocketService.onGroupDraftRandomised.pipe(takeUntil(this._unsubscribeAll)).subscribe({
      next: (response: GroupDraftRandomisedResponse) => {
        if (this.draft && this.draft.id == response.draftId) {

          response.athleteGroups.forEach(athGroup => {
            var athlete = this.draft?.athletes.find(f => f.id == athGroup.id);
          
            if (athlete != undefined)
              athlete.group = athGroup.group;      
          });

          this.sortDraftGroups();

          this.snackBar.open("The group draft order has been randomised!", "RANDOM", { duration: 5000 })
        }
      }
    });

    this.webSocketService.onAthleteGroupDrafted.pipe(takeUntil(this._unsubscribeAll)).subscribe({
      next: (response: AthleteGroupDraftedResponse) => {
        var user = this.draft?.users.find(x => x.id === response.userId);
        var draftGroup = this.draftGroups.find(f => f.group == response.group);

        if (!draftGroup || !user)
          return;

        draftGroup.athletes.forEach(athlete => {
          athlete.userId = response.userId;
          var draftAth = this.draft?.athletes.find(f => f.id == athlete.id);
          if (!!draftAth) {
            draftAth.userId = response.userId;
            user?.athletes.push(draftAth);
          }
        });

        this.snackBar.open(`${user?.username} drafted Group ${response.group + 1}`, "DRAFTED", { duration: 5000 });

        this.calculateGroupDraftData();
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
    if (!this.draft || !this.draft.users)
        return;

    var userIndex = this.getCurrentUserIndex();

    var user = this.draft.users[userIndex];
    
    this.draftService.draftAthlete(user.id, athlete.id)
      .then(() => {
        user.athletes.push(athlete);
        athlete.userId = user.id;
        this.calculatePicksRemaining();
        if (this.picksRemaining == 0) {
          if (!!this.draft)
            this.draftService.setDraftStatus(this.draft?.id, EDraftStatus.intermediate);

          return;
        }

        this.currentRound = this.calculateCurrentRound();
        this.currentRoundPick = this.calculateCurrentRoundPick();
        this.calculateCurrentTurnUser();
      },
      (error: HttpErrorResponse) => {
        if (error.status == 400 && error.error == "out_of_sync") {
          this.dialog.open(OutOfSyncDialogComponent, {
            disableClose: true
          });
        }
      }
    );
  }

  athleteIsDrafted(athlete: Athlete): boolean {
    var drafted = !!athlete.userId;

    return drafted;
  }

  userIsAdmin(): boolean {
    return this.userService.isAdmin();
  }

  startDraft(): void {
    if (!this.draft)
      return;

    const dialogRef = this.dialog.open(GenericConfirmDialogComponent, {
      data: { title: "Start Draft?", message: "Are you sure you want to start this draft?" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true && !!this.draft)
        this.draftService.setDraftStatus(this.draft.id, EDraftStatus.individualDraft);
    });
  }

  draftIsNotStarted(): boolean {
    return this.draft?.status == EDraftStatus.notStarted;
  }

  individualDraftIsInProgress(): boolean {
    return this.draft?.status == EDraftStatus.individualDraft;
  }

  draftIsInIntermediateState(): boolean {
    return this.draft?.status == EDraftStatus.intermediate;
  }

  groupDraftIsInProgress(): boolean {
    return this.draft?.status == EDraftStatus.groupDraft;
  }

  getDraftedUserData(userId: string): DraftedUserData | null {
    if (userId == null || userId == undefined)
      return null;

    var user = this.draft?.users.find(f => f.id == userId);

    if (user == undefined)
      return null;

    let draftedUserData: DraftedUserData = { id: user.id, username: user.username, hexColor: user.hexColor };

    return draftedUserData;
  }

  enableStartDraftButton(): boolean {
    return !!this.draft && this.orderedUsers.length > 0 && this.draftIsNotStarted();
  }

  groupDraftIsSetup(): boolean {
    return !!this.draft && this.draft.athletes.filter(f => f.group == -1 && !f.userId).length == 0;
  }

  randomiseDraft(): void {
    if (!this.draft)
      return;

    this.draftService.randomiseDraft(this.draft?.id);
  }

  getUser(userId: string): User {
    var user = this.draft?.users.find(f => f.id == userId);

    return user ? user : { id: "1", username: "error", athletes: [], drafts: [], hexColor: "", isAdmin: false, jwt: "" };
  }

  calculatePicksRemaining() {
    if (this.draft)
      this.picksRemaining = (this.draft.athletes.length / 2) - this.draft.athletes.filter(f => f.userId != null).length;
  }

  calculateCurrentRoundPick() : number {
    if (!this.draft)
        return 0;

    var currentPick = ((this.draft.athletes.length / 2) - this.picksRemaining);

    var roundPick = (currentPick % this.draft.users.length);

    return roundPick;
  }

  calculateCurrentRound() : number {
    if (!this.draft)
      return 0;

    var snakeLength = this.draft.users.length;
    var picksTaken = this.draft.athletes.filter(f => f.userId != null).length + 1;
    var round = Math.ceil(picksTaken/snakeLength);

    //console.log("Round calc", snakeLength, picksTaken, round)

    return round % 1 == 0 ? round : round + 1;
  }

  calculateTotalRounds() : number {
    if (!this.draft)
      return 0;

    var snakeLength = this.draft.users.length;
    var totalPicks = this.draft.athletes.length / 2;
    var rounds = totalPicks/snakeLength;

    return Math.ceil(rounds);
  }

  calculateCurrentTurnUser() {
    if (!this.draft)
      return;

    let users = this.orderedUsers.slice();

    if (this.currentRound % 2 == 0) //if round is even
      users.reverse();

    this.currentTurnUser = users[this.currentRoundPick];
  }

  calculateDraftData() {
    this.calculatePicksRemaining();
    this.totalRounds = this.calculateTotalRounds();
    this.currentRound = this.calculateCurrentRound();
    this.currentRoundPick = this.calculateCurrentRoundPick();
    this.calculateCurrentTurnUser();
  }

  isUsersTurn() : boolean {
    return this.userService.getId() == this.currentTurnUser?.id;
  }

  randomiseGroupDraft() {
    if (this.draft)
      this.draftService.randomiseGroupDraft(this.draft.id);
  }

  startGroupDraft() {
    if (this.draft)
      this.draftService.setDraftStatus(this.draft.id, EDraftStatus.groupDraft);
  }

  calculateGroupDraftData() {
    this.calculateGroupPicksRemaining();
    this.totalRounds = this.calculateTotalGroupRounds();
    this.currentRound = this.calculateCurrentGroupRound();
    this.currentRoundPick = this.calculateCurrentGroupRoundPick();
    this.calculateCurrentTurnUser();
  }

  calculateGroupPicksRemaining() {
    if (this.draft)
      this.picksRemaining = this.draft.athletes.filter(f => f.userId == null).length / this.draft.athletes.filter(f => f.group == 0).length;
  }

  calculateCurrentGroupRoundPick() : number {
    if (!this.draft)
        return 0;

    var groupSize = this.draft.athletes.filter(f => f.group == 0).length;
    var currentPick = ((this.draft.athletes.length / 2) / groupSize - this.picksRemaining);

    var roundPick = (currentPick % this.draft.users.length);

    return roundPick;
  }

  calculateCurrentGroupRound() : number {
    if (!this.draft)
      return 0;

    const snakeLength = this.draft.users.length;
    const groupSize = this.draft.athletes.filter(f => f.group == 0).length;

    var picksTaken = ((this.draft.athletes.filter(f => f.userId != null).length - (this.draft.athletes.length / 2)) / groupSize) + 1;
    var round = Math.ceil(picksTaken/snakeLength);

    return round % 1 == 0 ? round : round + 1;
  }

  calculateTotalGroupRounds() : number {
    if (!this.draft)
      return 0;

    var snakeLength = this.draft.users.length;
    var groupSize = this.draft.athletes.filter(f => f.group == 0).length;
    var totalPicks = (this.draft.athletes.length / 2) / groupSize;
    var rounds = totalPicks/snakeLength;

    return Math.ceil(rounds);
  }

  sortDraftGroups() {
    if (!this.draft)
      return;

    var groupedAthletes = this.draft.athletes.filter(f => f.group > -1);

    for (let index = 0; index < groupedAthletes.length; index++) {
      const athlete = groupedAthletes[index];
      var draftGroup = this.draftGroups.find(f => f.group == athlete.group);
      if (draftGroup == undefined)
        this.draftGroups.push({ group: athlete.group, athletes: [athlete] });
      else
        draftGroup.athletes.push(athlete);
    }

    this.draftGroups.sort((a, b) => a.group - b.group);
  }

  onGroupDraftPickEmitted(draftGroup: DraftGroup): void {
    if (!this.draft?.users)
        return;

    var userIndex = this.getCurrentUserIndex();

    var user = this.draft.users[userIndex];
    
    this.draftService.draftAthleteGroup(user.id, this.draft.id, draftGroup.group)
      .then(() => {
        draftGroup.athletes.forEach(athlete => {
          user.athletes.push(athlete);
          athlete.userId = user.id;
        });
        
        this.calculateGroupPicksRemaining();
        if (this.picksRemaining == 0) {
          if (!!this.draft)
            this.draftService.setDraftStatus(this.draft?.id, EDraftStatus.closed);

          return;
        }

        this.currentRound = this.calculateCurrentGroupRound();
        this.currentRoundPick = this.calculateCurrentGroupRoundPick();
        this.calculateCurrentTurnUser();
      },
      (error: HttpErrorResponse) => {
        if (error.status == 400 && error.error == "out_of_sync") {
          this.dialog.open(OutOfSyncDialogComponent, {
            disableClose: true
          });
        }
      }
    );
  }

  setSizing(width: number) {
    if (width >= 1200) {
      this.cols = 5;
    }
    else {
      this.cols = 3;
    }
  }
}