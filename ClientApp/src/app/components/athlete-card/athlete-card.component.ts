import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Athlete } from 'src/app/models/athlete';

@Component({
    selector: 'athlete-card',
    standalone: true,
    imports: [
        CommonModule,

        MatCardModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatTooltipModule
    ],
    templateUrl: './athlete-card.component.html',
    styleUrl: './athlete-card.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AthleteCardComponent { 
    @Input() athlete!: Athlete;

    onCardClick() : void {
        console.log("KB - cardclick", this.athlete)
    }
}
