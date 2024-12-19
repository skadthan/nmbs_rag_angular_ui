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
  ) {}

  login(): void {
    this.apiService.authenticate(this.username, this.password).subscribe(
      (response) => {
        this.stateManager.setLoggedIn(true);
        sessionStorage.setItem('refreshToken', response.refresh_token);
        sessionStorage.setItem('username', this.username)
        this.stateManager.username = this.username;
        this.router.navigate(['/chatbot']);
      },
      () => (this.errorMessage = 'Invalid credentials. Try again.')
    );

    
  }
}
