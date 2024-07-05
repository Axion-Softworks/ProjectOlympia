import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { debounceTime } from 'rxjs';
import { Medal } from 'src/app/models/medal';

@Component({
    selector: 'edit-medal',
    standalone: true,
    imports: [
        CommonModule,

        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule
    ],
    templateUrl: './edit-medal.component.html',
    styleUrl: './edit-medal.component.css',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class EditMedalComponent implements OnInit { 

    @Input() medal: Medal = { id: '', place: 0, event: '' };
    @Output() medalEmitter: EventEmitter<Medal> = new EventEmitter<Medal>();
    
    formgroup: FormGroup = new FormGroup({});
    localMedal: Medal = { id: "", event: "", place: 0 };

    constructor() {        
    }

    ngOnInit(): void {
        this.localMedal.id = this.medal.id;
        this.localMedal.event = this.medal.event;
        this.localMedal.place = this.medal.place;

        this.formgroup = new FormGroup (
            {
            event: new FormControl(
                this.localMedal.event,
                Validators.required
            ), 
            place: new FormControl(
                this.localMedal.place,
                Validators.required
            )
        });

        this.formgroup.controls['event'].valueChanges
            .pipe(debounceTime(500))
            .subscribe({
                next: (value) => { this.localMedal.event = value; this.medalEmitter.emit(this.localMedal); }
            })

        this.formgroup.controls['place'].valueChanges
            .pipe(debounceTime(500))
            .subscribe({
                next: (value) => { this.localMedal.place = value; this.medalEmitter.emit(this.localMedal); }
            })
    }
}