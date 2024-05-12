import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Athlete } from 'src/app/models/athlete';
import { AthleteConfirmDialogComponent } from './athlete-confirm-dialog/athlete-confirm-dialog.component';

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
    changeDetection: ChangeDetectionStrategy.Default,
})

export class AthleteCardComponent { 
    @Input() athlete!: Athlete;
    @Input() disabled: boolean = false;
    @Output() emitDraft: EventEmitter<Athlete> = new EventEmitter<Athlete>();

    constructor(public dialog: MatDialog) {
        
    }

    onCardClick() : void {
        if (this.disabled)
            return;

        const dialogRef = this.dialog.open(AthleteConfirmDialogComponent, {
            data: { athlete: this.athlete },
            maxWidth: '500px',
            minWidth: '400px'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result == true)
                this.emitDraft.emit(this.athlete);
        });
    }

    isDisabled(): boolean {
        return this.disabled;
    }
}
