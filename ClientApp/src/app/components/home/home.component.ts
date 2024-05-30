import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserService } from 'src/app/services/user.service';
import { DraftSelectionComponent } from '../draft-selection/draft-selection.component';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,

    DraftSelectionComponent
  ]
})
export class HomeComponent {
  public get loggedIn(): boolean { 
    return this.userService.loggedIn();
  }

  public get user(): User | undefined {
    return this.userService.user;
  }

  formgroup: FormGroup;

  constructor(private userService: UserService) {
    this.formgroup = new FormGroup(
      {username: new FormControl(), password: new FormControl()}
    );
  }

  login(): void {
    this.userService.login(this.formgroup);
  }

  getUsername(): string {
    return !!this.userService.user ? this.userService.user.username : "";
  }
}