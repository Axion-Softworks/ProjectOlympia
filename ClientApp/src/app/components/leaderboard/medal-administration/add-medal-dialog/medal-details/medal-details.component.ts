import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AthleteMedalData } from 'src/app/models/athlete-medal-data';
import { EditMedalComponent } from '../edit-medal/edit-medal.component';
import { MatButtonModule } from '@angular/material/button';
import { Medal } from 'src/app/models/medal';
import { MedalService } from 'src/app/services/medal.service';

@Component({
    selector: 'medal-details',
    standalone: true,
    imports: [
        CommonModule,

        MatButtonModule,

        EditMedalComponent
    ],
    templateUrl: './medal-details.component.html',
    styleUrl: './medal-details.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedalDetailsComponent implements OnInit { 

    @Input() athleteMedalData!: AthleteMedalData;
    @Output() savedChangesEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

    updatedAthleteMedalData!: AthleteMedalData;
    originalMedalData: Medal[] = [];
    dataChanged: boolean = false;
    saving: boolean = false;

    constructor(private medalService: MedalService) {

    }

    ngOnInit(): void {
        this.originalMedalData = [...this.athleteMedalData.medals];
        this.updatedAthleteMedalData = { athleteId: this.athleteMedalData.athleteId, medals: [...this.athleteMedalData.medals] }
    }

    onAddMedalButtonClick() {
        let medal: Medal = { id: self.crypto.randomUUID(), event: '', place: 0 };
        this.athleteMedalData.medals.push(medal);
        this.updatedAthleteMedalData.medals.push(medal);
    }

    medalDataValid(): boolean {
        return this.updatedAthleteMedalData.medals.every(f => this.isEmpty(f.event) == false);
    }

    isEmpty(value: string): boolean {
        return value == null || value == undefined || value.trim() == '';
    }

    onMedalEmitted(medal: Medal) {
        var index = this.updatedAthleteMedalData.medals.findIndex(f => f.id == medal.id);

        if (index > -1)
            this.updatedAthleteMedalData.medals[index] = medal;
        else 
            this.updatedAthleteMedalData.medals.push(medal);

        this.updateDataChanged();
    }

    updateDataChanged() {
        let changed = false;

        this.updatedAthleteMedalData.medals.forEach(medal => {
            if (this.medalHasChanged(medal))
                changed = true;
        });

        this.dataChanged = changed;
    }

    medalHasChanged(medal: Medal) : boolean {
        let changed = false;

        if (this.originalMedalData != undefined) {
            var filteredMedal = this.originalMedalData.find(f => f.id == medal.id);

            if (filteredMedal == undefined) //didn't exist before
                changed = true;
            else if (filteredMedal.event != medal.event || filteredMedal.place != medal.place) //values changed
                changed = true;
        }

        return changed;
    }

    onSaveChangesButtonClick() {
        if (this.saving)
            return;

        this.saving = true;

        this.medalService.manageMedalsByAthleteId(this.updatedAthleteMedalData)
            .then(() => {
                this.savedChangesEmitter.emit(true);
                this.saving = false;
            });
    }
}