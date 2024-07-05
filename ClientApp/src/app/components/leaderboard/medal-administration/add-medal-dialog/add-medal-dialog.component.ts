import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable, map, startWith } from 'rxjs';
import { Athlete } from 'src/app/models/athlete';
import { Medal } from 'src/app/models/medal';
import { AthleteMedalData } from 'src/app/models/athlete-medal-data';
import { MedalDetailsComponent } from './medal-details/medal-details.component';

@Component({
    selector: 'add-medal-dialog',
    standalone: true,
    imports: [
        CommonModule,
        AsyncPipe,

        MatDialogModule,
        MatButtonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
        ReactiveFormsModule,

        MedalDetailsComponent
    ],
    templateUrl: './add-medal-dialog.component.html',
    styleUrl: './add-medal-dialog.component.css',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class AddMedalDialogComponent implements OnInit { 

    athletes: Athlete[];
    athleteControl = new FormControl<string | Athlete>('');
    filteredAthletes: Observable<Athlete[]> = new Observable<Athlete[]>;
    selectedAthlete?: AthleteMedalData;
    editedMedals: Medal[] = [];

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<AddMedalDialogComponent>) {
        this.athletes = data.athletes;
    }

    ngOnInit() {
        this.filteredAthletes = this.athleteControl.valueChanges.pipe(
            startWith(''),
            map(value => {
                this.selectedAthlete = undefined;

                const name = typeof value === 'string' ? value : `${value?.forename} ${value?.surname}`;
                return name ? this._filter(name as string) : this.athletes.slice();
            }),
        );
    }

    private _filter(name: string): Athlete[] {
        const filterValue = name.toLowerCase();

        return this.athletes.filter(athlete => `${athlete.forename} ${athlete.surname}`.toLowerCase().includes(filterValue));
    }

    displayFn(athlete: Athlete): string {
        return athlete && `${athlete.forename} ${athlete.surname}` ? `${athlete.forename} ${athlete.surname}` : '';
    }

    onAthleteSelected(athlete: Athlete) {
        this.selectedAthlete = { athleteId: athlete.id, medals: [...athlete.medals] };
    }

    onSavedChangesEmitted(value: boolean) {
        if (value == true) {
            this.selectedAthlete = undefined;
            this.athleteControl.reset();
        }
    }
}