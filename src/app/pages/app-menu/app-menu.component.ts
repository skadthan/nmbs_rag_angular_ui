import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiClientService } from '../../services/api-client.service';

@Component({
  selector: 'app-menu',
  templateUrl: './app-menu.component.html',
  styleUrls: ['./app-menu.component.scss']
})
export class AppMenuComponent {
  menuOpen = false;

  constructor( private apiService: ApiClientService,private router: Router) {}

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
        // Call the backend to clear the refreshToken cookie
      this.apiService.signOut().subscribe({
        next: () => {
          // Clear any client-side storage
          sessionStorage.removeItem('accessToken'); // Clear token from session storage
          sessionStorage.removeItem('currentSessionId'); // Clear currentSessionId from session storage
          sessionStorage.removeItem('activeSessionId') // Clear token from session storage
    
          // Redirect to the login page
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Error during logout:', error);
          alert('Logout failed. Please try again.');
        },
      });
        this.router.navigate(['/login']); // Redirect to login

    this.router.navigate(['/login']);
  }
}
