import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'out-of-sync-dialog',
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
    templateUrl: './out-of-sync-dialog.component.html',
    styleUrl: './out-of-sync-dialog.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OutOfSyncDialogComponent { 

    constructor(public dialogRef: MatDialogRef<OutOfSyncDialogComponent>) {
    }

    onRefreshClick() {
        location.reload();
    }
}