import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DraftGroup } from 'src/app/models/draft-group';

@Component({
    selector: 'athlete-group-confirm-dialog',
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
    templateUrl: './athlete-group-confirm-dialog.component.html',
    styleUrl: './athlete-group-confirm-dialog.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AthleteGroupConfirmDialogComponent { 

    public draftGroup: DraftGroup;
    public buttonsEnabled: boolean = false;

    constructor(public dialogRef: MatDialogRef<AthleteGroupConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        
        this.draftGroup = data.draftGroup;
        this.buttonsEnabled = data.buttonsEnabled;
    }

    onNoClick() {
        this.dialogRef.close();
    }

}