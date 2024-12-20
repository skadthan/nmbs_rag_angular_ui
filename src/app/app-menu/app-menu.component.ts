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
    event.stopPropagation(); // Prevent event bubbling
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
    this.closeMenu();
  }
}
