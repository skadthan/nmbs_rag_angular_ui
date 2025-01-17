import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  isAuthenticated: string='';
  constructor(private router: Router) {}

  canActivate(): boolean {
    // Example logic: Check if the token exists in local storage
    //const isAuthenticated = !!localStorage.getItem('token');
    if (typeof sessionStorage !== 'undefined') {
      this.isAuthenticated = sessionStorage.getItem('refreshToken')||'';
    }
    //const isAuthenticated = !!sessionStorage.getItem('refreshToken');

    if (!this.isAuthenticated) {
      console.warn('Not authenticated! Redirecting to login...');
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
