import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { AthleteLeaderboardData } from 'src/app/models/athlete-leaderboard-data';
import { LeaderboardAthleteSummaryComponent } from './leaderboard-athlete-summary/leaderboard-athlete-summary.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'leaderboard-athlete-summary-dialog',
    standalone: true,
    imports: [
        CommonModule,

        MatTableModule,
        MatDialogModule,
        MatButtonModule,

        LeaderboardAthleteSummaryComponent
    ],
    templateUrl: './leaderboard-athlete-summary-dialog.component.html',
    styleUrl: './leaderboard-athlete-summary-dialog.component.css',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class LeaderboardAthleteSummaryDialogComponent { 

    athleteData: AthleteLeaderboardData[] = [];
    name: string;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
        this.athleteData = data.athleteData;
        this.name = data.name;
    }
}