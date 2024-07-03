import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { AthleteLeaderboardData } from 'src/app/models/athlete-leaderboard-data';
import { Draft } from 'src/app/models/draft';
import { EPlace } from 'src/app/models/e-place';
import { LeaderboardData } from 'src/app/models/leaderboard-data';
import { User } from 'src/app/models/user';
import { DraftService } from 'src/app/services/draft-service';
import { LeaderboardAthleteSummaryComponent } from './leaderboard-athlete-summary-dialog/leaderboard-athlete-summary/leaderboard-athlete-summary.component';
import { MatDialog } from '@angular/material/dialog';
import { LeaderboardAthleteSummaryDialogComponent } from './leaderboard-athlete-summary-dialog/leaderboard-athlete-summary-dialog.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'leaderboard',
    standalone: true,
    imports: [
        CommonModule,

        MatTableModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatButtonModule,

        LeaderboardAthleteSummaryComponent
    ],
    templateUrl: './leaderboard.component.html',
    styleUrl: './leaderboard.component.css',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class LeaderboardComponent { 

    users: User[] = [];
    leaderboardData: LeaderboardData[] = [];

    displayedColumns: string[] = ['name', 'bronze', 'silver', 'gold', 'points', 'details'];

    constructor(
        private route: ActivatedRoute,
        private draftService: DraftService,
        private dialog: MatDialog
    ) {
        var draftId = this.route.snapshot.paramMap.get('id');

        if (!!draftId) {
            this.draftService.getDraft(draftId)
            .then((result: Draft) => {
                result.users.forEach(user => {
                    user.athletes = result.athletes.filter(f => f.userId == user.id);
                });

                this.users = result.users;
                this.processUsersToLeaderboardData();

                console.log(this.users, this.leaderboardData);
            });
        }
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
                    points: bronzeValue + (silverValue * 2) + (goldValue * 4)
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
    }

    showDetails(leaderboardData: LeaderboardData) {
        const dialogRef = this.dialog.open(LeaderboardAthleteSummaryDialogComponent, {
            data: { athleteData: leaderboardData.athleteLeaderboardData, name: leaderboardData.name },
            maxWidth: '600px',
            minWidth: '400px'
        })
    }
}