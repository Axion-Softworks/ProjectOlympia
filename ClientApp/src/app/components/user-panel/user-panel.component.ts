import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { User } from 'src/app/models/user';

@Component({
    selector: 'user-panel',
    standalone: true,
    imports: [
        CommonModule,

        MatExpansionModule,
        MatTooltipModule
    ],
    templateUrl: './user-panel.component.html',
    styleUrl: './user-panel.component.css',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class UserPanelComponent { 
    @Input() user!: User;
    @Input() enableUserHighlight: boolean = false;

    constructor() {}

    getUserBorderStyle(): Object {
        //TODO: ONLY RETURN IF IT IS THAT USERS TURN
        if (!this.enableUserHighlight)
            return {};

        var style = {
            'border': this.user.hexColor,
            'border-width': 'thin',
            'border-style': 'groove'
        }

        return style;
    }
}
