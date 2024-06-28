import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'leaderboard',
    standalone: true,
    imports: [
        CommonModule,
    ],
    templateUrl: './leaderboard.component.html',
    styleUrl: './leaderboard.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeaderboardComponent { }
