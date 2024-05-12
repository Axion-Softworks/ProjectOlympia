import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Player } from 'src/app/models/player';

@Component({
    selector: 'player-panel',
    standalone: true,
    imports: [
        CommonModule,

        MatExpansionModule,
        MatTooltipModule
    ],
    templateUrl: './player-panel.component.html',
    styleUrl: './player-panel.component.css',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class PlayerPanelComponent { 
    @Input() player!: Player;

    constructor() {        
    }
}
