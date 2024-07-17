import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Athlete } from 'src/app/models/athlete';
import { AthleteGroupConfirmDialogComponent } from './athlete-group-confirm-dialog/athlete-group-confirm-dialog.component';
import { DraftedUserData } from 'src/app/models/drafted-user-data';
import { DraftGroup } from 'src/app/models/draft-group';

@Component({
    selector: 'athlete-group-card',
    standalone: true,
    imports: [
        CommonModule,

        MatCardModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatTooltipModule
    ],
    templateUrl: './athlete-group-card.component.html',
    styleUrl: './athlete-group-card.component.css',
    changeDetection: ChangeDetectionStrategy.Default,
})

export class AthleteGroupCardComponent { 
    @Input() draftGroup!: DraftGroup;
    @Input() disabled: boolean = false;
    @Input() draftStarted: boolean = false;
    @Input() draftedUserData?: DraftedUserData | null;
    @Input() userTurn: boolean = false;
    @Output() emitDraft: EventEmitter<DraftGroup> = new EventEmitter<DraftGroup>();

    constructor(public dialog: MatDialog) {
        
    }

    onCardClick() : void {
        if (this.disabled)
            return;

        const dialogRef = this.dialog.open(AthleteGroupConfirmDialogComponent, {
            data: { draftGroup: this.draftGroup, buttonsEnabled: this.draftStarted && this.userTurn },
            maxWidth: '500px',
            minWidth: '250px'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result == true)
                this.emitDraft.emit(this.draftGroup);
        });
    }

    isDisabled(): boolean {
        return this.disabled;
    }
}