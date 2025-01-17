import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppMenuComponent } from "../app-menu/app-menu.component";
import { ApiClientService } from '../../services/api-client.service';

@Component({
  selector: 'app-role-update',
  imports: [ FormsModule,CommonModule, RouterModule, AppMenuComponent ],
  templateUrl: './role-update.component.html',
  styleUrl: './role-update.component.scss'
})
export class RoleUpdateComponent {

  username: string='';
  token: string='';

    constructor(
      private router: Router,
      private apiService: ApiClientService,
    ) {}

  roles = {
    adminAccess: true,
    chatUser: false,
  };
  user = {
    avatar: 'assets/images/ashu-tech.png', // Replace with the actual path to the avatar image
    firstName: 'Suresh',
    lastName: 'Kadthan',
    email: 'skadthan@example.com',
    phone: '+1 (555) 123-4567',
  };
  user_roles: any[] = []; // Roles will be fetched from the API


  ngOnInit(): void {
    this.username = sessionStorage.getItem("username") || '';
    this.token = sessionStorage.getItem('accessToken') || '';
    this.user.firstName =  sessionStorage.getItem('first_name') || '';
    this.user.email=sessionStorage.getItem('email') || '';
    this.fetchRoles(this.username, this.token);
  }

  fetchRoles(user_id: string, token: string): void {
    // Replace 'your-api-endpoint' with the actual endpoint URL
    this.apiService.fetchUserRoles(user_id, token).subscribe(
      (response: any) => {
        this.user_roles = response.roles; // Populate roles array
        console.log("this.user_roles: ",this.user_roles)
      },
      (error) => {
        console.error('Error fetching roles:', error);
      }
    );
  }

  saveRoles() {
    console.log('Roles updated:', this.roles);
    // Call service to save role information
  }

  navigateBack(): void {
    this.router.navigate(['/chatbot']);
  }
}