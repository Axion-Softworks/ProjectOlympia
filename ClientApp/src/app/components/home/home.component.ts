import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { DraftSelectionComponent } from '../draft-selection/draft-selection.component';
import { User } from 'src/app/models/user';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true,
  imports: [
    CommonModule,

    DraftSelectionComponent
  ]
})
export class HomeComponent {
  public get user(): User | undefined {
    return this.userService.user;
  }

  constructor(private userService: UserService) {
  }

  getUsername(): string {
    return !!this.user ? this.user.username : "";
  }
}