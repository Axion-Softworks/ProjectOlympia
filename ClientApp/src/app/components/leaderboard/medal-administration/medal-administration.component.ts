import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AddMedalDialogComponent } from './add-medal-dialog/add-medal-dialog.component';
import { Athlete } from 'src/app/models/athlete';

@Component({
    selector: 'medal-administration',
    standalone: true,
    imports: [
        CommonModule,

        MatButtonModule,
    ],
    templateUrl: './medal-administration.component.html',
    styleUrl: './medal-administration.component.css',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class MedalAdministrationComponent { 

    @Input() athletes!: Athlete[];

    constructor(private dialog: MatDialog) {
        
    }

    onAddMedalButtonClick() {
        var dialogRef = this.dialog.open(AddMedalDialogComponent, {
            data: { athletes: this.athletes },
            maxWidth: '500px',
            minWidth: '500px'
        })

        dialogRef.afterClosed().subscribe({
            next: (result: boolean) => { 
                if (result == true)
                    this.updateAthletes() },
        });
    }

    updateAthletes() {
        console.log(this.athletes[0].medals);
    }
}
