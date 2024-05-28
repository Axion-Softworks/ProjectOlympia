import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AppService } from 'src/app/app.service';

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
    MatFormFieldModule
  ]
})
export class HomeComponent {
  public get loggedIn(): boolean { 
    return this.appService.loggedIn();
  }

  formgroup: FormGroup;

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string, private appService: AppService) {
    this.formgroup = new FormGroup(
      {username: new FormControl(), password: new FormControl()}
    );
  }

  login(): void {
    console.log("Login!", this.formgroup.value)

    this.http.post<any>(this.baseUrl + 'api/login', this.formgroup.value).subscribe(result => {
      console.log(result);
      sessionStorage.setItem('user', JSON.stringify(result));
    }, error => console.error(error));
  }
}