import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Ensure this import is present
import { ApiClientService } from '../../services/api-client.service';
import { StateManagerService } from '../../utils/state-manager.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private apiService: ApiClientService,
    private stateManager: StateManagerService,
    private router: Router
  ) {
    //console.log("apiService: ",apiService);
  }

  login(): void {
    this.apiService.authenticate(this.username, this.password).subscribe(
      (response) => {
        //this.stateManager.setLoggedIn(true);
        //sessionStorage.setItem('refreshToken', response.refresh_token);
        sessionStorage.setItem('accessToken', response.access_token);
        sessionStorage.setItem('username', this.username)
        sessionStorage.setItem('userid', this.username)
        this.stateManager.username = this.username;
        this.router.navigate(['/chatbot']);
      },
      (error) => {
        // Handle error gracefully and display a user-friendly message
        //console.debug("login error: ", error)
        if (error.status === 401) {
          this.errorMessage = 'Invalid username or password. Please try again.';
        }
        else if (error.status === 404) {
          this.errorMessage = 'User not found in the database. Please try to register a profile';
        } else {
         
          this.errorMessage = 'An unexpected error occurred. Please try again later.';
        }
      }
    );
    
  }

  logout() {
    sessionStorage.removeItem('accessToken'); // Clear token from local storage
    this.router.navigate(['/login']); // Redirect to login
  }
  
}
