import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AthleteLeaderboardData } from 'src/app/models/athlete-leaderboard-data';
import { EPlace } from 'src/app/models/e-place';

@Component({
    selector: 'leaderboard-athlete-summary',
    standalone: true,
    imports: [
        CommonModule,

        MatTableModule,
        MatTooltipModule,
        MatIconModule
    ],
    templateUrl: './leaderboard-athlete-summary.component.html',
    styleUrl: './leaderboard-athlete-summary.component.css',
    changeDetection: ChangeDetectionStrategy.Default,
    animations: [
      trigger('detailExpand', [
        state('collapsed,void', style({height: '0px', minHeight: '0'})),
        state('expanded', style({height: '*'})),
        transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      ]),
    ],
})
export class LeaderboardAthleteSummaryComponent implements OnInit { 

    @Input() athleteData: AthleteLeaderboardData[] = [];
    @Input() mobile: boolean = false;

    displayedColumns: string[] = ['name', 'discipline', 'bronze', 'silver', 'gold', 'points'];
    mobileDisplayedColumns: string[] = ['name', 'bronze', 'silver', 'gold', 'points'];
    expandedAthleteData: AthleteLeaderboardData | null = null;

    constructor() {
    }

    ngOnInit(): void {
        this.athleteData.sort((a, b) => {
            return b.points - a.points || b.gold - a.gold || b.silver - a.silver || b.bronze - a.bronze || a.name.localeCompare(b.name);
        })
    }

    parsePlace(place: EPlace) : string {
        switch (place) {
            case EPlace.bronze:
                return "Bronze";

            case EPlace.silver:
                return "Silver";

            case EPlace.gold:
                return "Gold";
            
            default:
                return '';
        }
    }

    parsePlaceColor(place: EPlace) : string {
        switch (place) {
            case EPlace.bronze:
                return "#CD7F32";

            case EPlace.silver:
                return "#C0C0C0";

            case EPlace.gold:
                return "#FFD700";
            
            default:
                return '';
        }
    }

    getTooltip(datum: AthleteLeaderboardData) : string {
        if (this.mobile)
            return `${datum.discipline}: ${datum.description}`;
        else 
            return datum.description;
    }
}