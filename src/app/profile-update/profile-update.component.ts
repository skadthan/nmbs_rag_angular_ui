import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StateManagerService } from '../utils/state-manager.service';
import { AppMenuComponent } from "../app-menu/app-menu.component";
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.scss'],
  imports: [FormsModule, CommonModule, RouterModule, AppMenuComponent] // Add FormsModule here
 // Add FormsModule here
})


export class ProfileUpdateComponent {

  constructor(
    private stateManager: StateManagerService,
    private router: Router
  ) {}
  user = {
    avatar: 'assets/images/ashu-tech.png', // Replace with the actual path to the avatar image
    firstName: 'Suresh',
    lastName: 'Kadthan',
    email: 'skadthan@example.com',
    phone: '+1 (555) 123-4567',
  };

  password = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  roles = {
    adminAccess: true,
    chatUser: false,
  };

  saveChanges() {
    // Add logic to save changes, e.g., call an API
    console.log('Profile updated:', this.user);
    console.log('Password updated:', this.password);
    console.log('Roles updated:', this.roles);
  }

  navigateBack(): void {
    this.router.navigate(['/chatbot']);
  }
}
