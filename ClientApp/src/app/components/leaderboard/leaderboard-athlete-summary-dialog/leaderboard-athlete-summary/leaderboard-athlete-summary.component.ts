import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AthleteLeaderboardData } from 'src/app/models/athlete-leaderboard-data';

@Component({
    selector: 'leaderboard-athlete-summary',
    standalone: true,
    imports: [
        CommonModule,

        MatTableModule,
        MatTooltipModule
    ],
    templateUrl: './leaderboard-athlete-summary.component.html',
    styleUrl: './leaderboard-athlete-summary.component.css',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class LeaderboardAthleteSummaryComponent implements OnInit { 

    @Input() athleteData: AthleteLeaderboardData[] = [];

    displayedColumns: string[] = ['name', 'bronze', 'silver', 'gold', 'points'];


    constructor() {
        
    }

    ngOnInit(): void {
        this.athleteData.sort((a, b) => {
            return b.points - a.points || b.gold - a.gold || b.silver - a.silver || b.bronze - a.bronze || a.name.localeCompare(b.name);
        })
    }
}