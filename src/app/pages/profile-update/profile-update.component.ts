import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StateManagerService } from '../../utils/state-manager.service';
import { AppMenuComponent } from "../app-menu/app-menu.component";
import { Router } from '@angular/router';
import { ApiClientService } from '../../services/api-client.service';

@Component({
  standalone: true,
  selector: 'app-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.scss'],
  imports: [FormsModule, CommonModule, RouterModule, AppMenuComponent] // Add FormsModule here
 // Add FormsModule here
})


export class ProfileUpdateComponent {

  currentRoute: string = '';
  username: string='';
  token: string='';

  constructor(
    private stateManager: StateManagerService,
    private router: Router,
    private apiService: ApiClientService,
  ) {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url; // Capture the current route
    });
  }
  user = {
    avatar: 'assets/images/ashu-tech.png', // Replace with the actual path to the avatar image
    firstName: 'Suresh',
    lastName: 'Kadthan',
    email: 'skadthan@example.com',
    dateofbirth: '07/08/1983',
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

  
  ngOnInit(): void {
    this.username = sessionStorage.getItem("username") || '';
    this.token = sessionStorage.getItem('refreshToken') || '';
    this.fetchUser(this.username, this.token);
  }

  saveProfile() {
    // Add logic to save changes, e.g., call an API
    console.log('Profile updated:', this.user);
    console.log('Password updated:', this.password);
    console.log('Roles updated:', this.roles);
  }

  navigateBack(): void {
    this.router.navigate(['/chatbot']);
  }


  fetchUser(user_id: string, token: string): void {
    // Replace 'your-api-endpoint' with the actual endpoint URL
    this.apiService.fetchUser(user_id, token).subscribe(
      (response: any) => {
        this.user.firstName = response.first_name; // Populate roles array
        this.user.lastName = response.last_name; // Populate roles array
        //this.user.dateofbirth = response.date_of_birth; // Populate roles array
        this.user.email = response.email; // Populate roles array

       const [month, day, year] = response.date_of_birth.split('/');
       this.user.dateofbirth = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        console.log("this.user : ",this.user)
      },
      (error) => {
        console.error('Error fetching roles:', error);
      }
    );
  }
}
