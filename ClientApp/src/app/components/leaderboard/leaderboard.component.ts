import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { AthleteLeaderboardData } from 'src/app/models/athlete-leaderboard-data';
import { Draft } from 'src/app/models/draft';
import { EPlace } from 'src/app/models/e-place';
import { LeaderboardData } from 'src/app/models/leaderboard-data';
import { User } from 'src/app/models/user';
import { DraftService } from 'src/app/services/draft.service';
import { LeaderboardAthleteSummaryComponent } from './leaderboard-athlete-summary-dialog/leaderboard-athlete-summary/leaderboard-athlete-summary.component';
import { MatDialog } from '@angular/material/dialog';
import { LeaderboardAthleteSummaryDialogComponent } from './leaderboard-athlete-summary-dialog/leaderboard-athlete-summary-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from 'src/app/services/user.service';
import { MedalAdministrationComponent } from './medal-administration/medal-administration.component';
import { Athlete } from 'src/app/models/athlete';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { AthleteMedalData } from 'src/app/models/athlete-medal-data';
import { Subject, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'leaderboard',
    standalone: true,
    imports: [
        CommonModule,

        MatTableModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatButtonModule,

        LeaderboardAthleteSummaryComponent,
        MedalAdministrationComponent
    ],
    templateUrl: './leaderboard.component.html',
    styleUrl: './leaderboard.component.css',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class LeaderboardComponent implements OnDestroy { 
    private _unsubscribeAll: Subject<any> = new Subject();

    athletes: Athlete[] = [];
    users: User[] = [];
    leaderboardData: LeaderboardData[] = [];

    displayedColumns: string[] = ['name', 'bronze', 'silver', 'gold', 'points', 'details'];

    constructor(
        private route: ActivatedRoute,
        private draftService: DraftService,
        private userService: UserService,
        private websocketService: WebSocketService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar
    ) {
        var draftId = this.route.snapshot.paramMap.get('id');

        if (!!draftId) {
            this.draftService.getDraftWithMedals(draftId)
            .then((result: Draft) => {
                this.athletes = result.athletes;

                result.users.forEach(user => {
                    user.athletes = result.athletes.filter(f => f.userId == user.id);
                });

                this.users = result.users;
                this.processUsersToLeaderboardData();

                //console.log(this.users, this.leaderboardData);
            });
        }

        this.websocketService.onMedalsManaged.pipe(takeUntil(this._unsubscribeAll)).subscribe({
            next: (data: AthleteMedalData) => {
                var athlete = this.athletes.find(f => f.id == data.athleteId);
                
                if (!athlete)
                    return;

                athlete.medals = data.medals;
                this.updateAthleteScoreData(data);          
                
                this.snackBar.open(`Medals updated for ${athlete.forename} ${athlete.surname}`, "UPDATE", { duration: 5000 })  
            }
        })
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    processUsersToLeaderboardData() {
        this.leaderboardData = [];

        this.users.forEach(user => {
            let bronzeCount = 0;
            let silverCount = 0;
            let goldCount = 0;
            let athleteLeaderboardData: AthleteLeaderboardData[] = [];

            user.athletes.forEach(athlete => {
                let bronzeValue = athlete.medals.filter(f => f.place == EPlace.bronze).length;
                let silverValue = athlete.medals.filter(f => f.place == EPlace.silver).length;
                let goldValue = athlete.medals.filter(f => f.place == EPlace.gold).length;

                bronzeCount += bronzeValue;
                silverCount += silverValue;
                goldCount += goldValue;

                let datum: AthleteLeaderboardData = {
                    athleteId: athlete.id,
                    country: athlete.country,
                    iso: athlete.iso,
                    name: `${athlete.forename} ${athlete.surname}`,
                    bronze: bronzeValue,
                    silver: silverValue,
                    gold: goldValue,
                    points: bronzeValue + (silverValue * 2) + (goldValue * 4),
                    medals: athlete.medals
                };

                athleteLeaderboardData.push(datum);
            });

            let data: LeaderboardData = {
                userId: user.id,
                name: user.username,
                hexColour: user.hexColor,
                bronze: bronzeCount,
                silver: silverCount,
                gold: goldCount,
                points: bronzeCount + (silverCount * 2) + (goldCount * 4),
                athleteLeaderboardData: athleteLeaderboardData
            };

            this.leaderboardData.push(data);
        });

        this.leaderboardData.sort((a, b) => { 
            return b.points - a.points || b.gold - a.gold || b.silver - a.silver || b.bronze - a.bronze;
        })
    }

    showDetails(leaderboardData: LeaderboardData) {
        const dialogRef = this.dialog.open(LeaderboardAthleteSummaryDialogComponent, {
            data: { athleteData: leaderboardData.athleteLeaderboardData, name: leaderboardData.name },
            maxWidth: '600px',
            minWidth: '400px'
        })
    }

    isAdmin(): boolean {
        return this.userService.isAdmin();
    }

    updateAthleteScoreData(data: AthleteMedalData) {
        var user = this.users.find(f => f.athletes.findIndex(f => f.id == data.athleteId) > -1);

        if (!user)
            return;

        var athlete = user.athletes.find(f => f.id == data.athleteId);

        if (!athlete)
            return;

        athlete.medals = data.medals;

        this.athletes = [...this.athletes];

        this.processUsersToLeaderboardData();
    }
}