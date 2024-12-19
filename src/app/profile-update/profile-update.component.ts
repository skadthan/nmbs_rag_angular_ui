import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.scss'],
  imports: [FormsModule, CommonModule] // Add FormsModule here
})
export class ProfileUpdateComponent {
  profile = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
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
    console.log('Profile updated:', this.profile);
    console.log('Password updated:', this.password);
    console.log('Roles updated:', this.roles);
  }
}
