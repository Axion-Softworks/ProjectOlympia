import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Athlete } from 'src/app/models/athlete';

@Component({
    selector: 'athlete-confirm-dialog',
    standalone: true,
    imports: [
        CommonModule,
        
        MatButtonModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatTooltipModule
    ],
    templateUrl: './athlete-confirm-dialog.component.html',
    styleUrl: './athlete-confirm-dialog.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AthleteConfirmDialogComponent { 

    public athlete: Athlete;

    constructor(public dialogRef: MatDialogRef<AthleteConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        
        this.athlete = data.athlete;
    }

    onNoClick() {
        this.dialogRef.close();
    }

}