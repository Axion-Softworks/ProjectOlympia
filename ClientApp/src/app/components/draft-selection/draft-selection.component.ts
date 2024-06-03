import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { DraftSummary } from 'src/app/models/draft-summary';
import { EDraftStatus } from 'src/app/models/e-draft-status';
import { DraftService } from 'src/app/services/draft-service';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'draft-selection',
    standalone: true,
    imports: [
        CommonModule,

        MatButtonModule,
        MatTableModule,
        MatProgressSpinnerModule,
    ],
    templateUrl: './draft-selection.component.html',
    styleUrl: './draft-selection.component.css',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class DraftSelectionComponent { 

    openDrafts: DraftSummary[] = [];
    inProgressDrafts: DraftSummary[] = [];
    closedDrafts: DraftSummary[] = [];
    displayedColumns: string[] = ['name', 'athletes', 'users', 'button'];

    loadingDrafts: boolean;

    constructor(private userService: UserService, private draftService: DraftService, private router: Router) {
        this.loadingDrafts = true;
        this.draftService.getDraftSummariesByUserId(this.userService.getId())
            .then((result: DraftSummary[]) => {
                this.openDrafts = result.filter(f => f.status == EDraftStatus.open);
                this.inProgressDrafts = result.filter(f => f.status == EDraftStatus.inProgress);
                this.closedDrafts = result.filter(f => f.status == EDraftStatus.closed);
                this.loadingDrafts = false;
            });
    }

    getUsername(): string {
        return !!this.userService.user ? this.userService.user.username : "";
    }

    openDraft(id: string): void {
        this.router.navigate(['/draft', id])
    }
}