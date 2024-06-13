import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'generic-confirm-dialog',
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
    templateUrl: './generic-confirm-dialog.component.html',
    styleUrl: './generic-confirm-dialog.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericConfirmDialogComponent { 
    message: string = "";
    title: string = "";

    constructor(public dialogRef: MatDialogRef<GenericConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        
        this.message = data.message;
        this.title = data.title;
    }

    onNoClick() {
        this.dialogRef.close();
    }
}