import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    // Example logic: Check if the token exists in local storage
    //const isAuthenticated = !!localStorage.getItem('token');
    const isAuthenticated = !!sessionStorage.getItem('refreshToken');

    if (!isAuthenticated) {
      console.warn('Not authenticated! Redirecting to login...');
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
