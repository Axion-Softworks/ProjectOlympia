import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Draft } from 'src/app/models/draft';
import { EPlace } from 'src/app/models/e-place';
import { LeaderboardData } from 'src/app/models/leaderboard-data';
import { User } from 'src/app/models/user';
import { DraftService } from 'src/app/services/draft-service';

@Component({
    selector: 'leaderboard',
    standalone: true,
    imports: [
        CommonModule,

        MatTableModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './leaderboard.component.html',
    styleUrl: './leaderboard.component.css',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class LeaderboardComponent { 

    users: User[] = [];
    leaderboardData: LeaderboardData[] = [];

    displayedColumns: string[] = ['name', 'bronze', 'silver', 'gold', 'points'];

    constructor(
        private route: ActivatedRoute,
        private draftService: DraftService
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
            user.athletes.forEach(athlete => {
                bronzeCount += athlete.medals.filter(f => f.place == EPlace.bronze).length;
                silverCount += athlete.medals.filter(f => f.place == EPlace.silver).length;
                goldCount += athlete.medals.filter(f => f.place == EPlace.gold).length;
            });

            let data: LeaderboardData = {
                userId: user.id,
                name: user.username,
                hexColour: user.hexColor,
                bronze: bronzeCount,
                silver: silverCount,
                gold: goldCount,
                points: bronzeCount + (silverCount * 2) + (goldCount * 4)
            };

            this.leaderboardData.push(data);
        });
    }
}