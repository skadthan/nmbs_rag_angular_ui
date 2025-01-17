import { Injectable,Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import {AuthService} from '../services/auth-service'

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  isAuthenticated: boolean=false;
  constructor(@Inject(PLATFORM_ID)  private platformId: Object, private router: Router, private authService: AuthService) {}

  canActivate(): boolean {
    // Example logic: Check if the token exists in session storage
    //console.log("this.platformId: ",this.platformId)
    //console.log("isPlatformBrowser(this.platformId): ",isPlatformBrowser(this.platformId))
    if (isPlatformBrowser(this.platformId))  {
      const accessToken = sessionStorage.getItem('accessToken');
      //console.warn('accessToken : ',accessToken);
      if (accessToken && !this.authService.isTokenExpiringSoon(accessToken)) {
        return this.isAuthenticated = true; // Authenticated
      }
    }
   
    //console.warn('this.isAuthenticated: ',this.isAuthenticated);
    if (!this.isAuthenticated) {
      console.warn('Not authenticated! Redirecting to login...');
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
