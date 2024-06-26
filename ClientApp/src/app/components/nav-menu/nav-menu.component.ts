import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  public get loggedIn(): boolean { 
    return this.userService.loggedIn();
  }
  
  constructor(private userService: UserService, private router: Router) {}

  isExpanded = false;

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  logOut() {
    this.userService.logOut();
    this.router.navigate(['/']);
  }

  routeHome(): void {
    if (this.userService.loggedIn())
      this.router.navigate(['home']);
    else 
      this.router.navigate(['/']);
  }

  getUserName(): string {
    return this.userService.getUsername();
  }
}