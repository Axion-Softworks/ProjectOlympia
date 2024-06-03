import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatInputModule,
    MatButtonModule,
    MatFormFieldModule
  ]
})
export class LoginComponent {

  formgroup: FormGroup;

  constructor(private userService: UserService) {
    this.formgroup = new FormGroup(
      {username: new FormControl(), password: new FormControl()}
    );
  }

  login(): void {
    this.userService.login(this.formgroup);
  }
}