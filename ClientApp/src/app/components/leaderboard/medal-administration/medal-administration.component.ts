import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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
export class MedalAdministrationComponent implements OnInit, OnChanges { 

    @Input() athletes!: Athlete[];
    athletesWithMissingData: Athlete[] = [];

    constructor(private dialog: MatDialog) {
        
    }

    ngOnInit(): void {
        this.findAthletesWithMissingData();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.findAthletesWithMissingData();
    }

    onAddMedalButtonClick() {
        var dialogRef = this.dialog.open(AddMedalDialogComponent, {
            data: { athletes: this.athletes },
            maxWidth: '500px',
            minWidth: '500px'
        })
    }

    findAthletesWithMissingData() {
        this.athletesWithMissingData = [];

        this.athletes.forEach(athlete => {
            if (athlete.medals.findIndex(f => this.isEmpty(f.event)) > -1) {
                this.athletesWithMissingData.push(athlete);
            }
        });

        console.log(this.athletesWithMissingData)
    }

    isEmpty(value: string): boolean {
        return value == null || value == undefined || value.trim() == '';
    }

    onAmendMissingDataButtonClick() {
        var dialogRef = this.dialog.open(AddMedalDialogComponent, {
            data: { athletes: this.athletesWithMissingData },
            maxWidth: '500px',
            minWidth: '500px'
        })
    }
}
