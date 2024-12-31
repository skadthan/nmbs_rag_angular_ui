import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './app-menu.component.html',
  styleUrls: ['./app-menu.component.scss']
})
export class AppMenuComponent {
  menuOpen = false;

  constructor(private router: Router) {}

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  navigateTo(path: string): void {
    this.menuOpen = false;
    this.router.navigate([path]);
  }

  logout(): void {
    this.menuOpen = false;
    // Perform logout actions here
    //localStorage.removeItem('refreshToken'); // Clear token from local storage
    sessionStorage.removeItem('refreshToken'); // Clear token from session storage
    sessionStorage.removeItem('currentSessionId'); // Clear currentSessionId from session storage
    sessionStorage.removeItem('activeSessionId') // Clear token from session storage

    this.router.navigate(['/login']);
  }
}
