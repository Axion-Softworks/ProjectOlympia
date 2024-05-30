import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { DraftSummary } from 'src/app/models/draft-summary';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'draft-selection',
    standalone: true,
    imports: [
        CommonModule,

        MatCardModule,
        MatButtonModule
    ],
    templateUrl: './draft-selection.component.html',
    styleUrl: './draft-selection.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DraftSelectionComponent { 

    drafts: DraftSummary[] = [];

    constructor(private userService: UserService, private router: Router) {
        this.drafts = this.userService.getUserDrafts();
    }

    getUsername(): string {
        return !!this.userService.user ? this.userService.user.username : "";
    }

    openDraft(id: string): void {
        console.log(this.drafts.find(f=>f.id == id));
        this.router.navigate(['/fetch-data', id])
    }
}