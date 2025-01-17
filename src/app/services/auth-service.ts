import { Injectable } from '@angular/core';
import {jwtDecode} from 'jwt-decode';
import { ApiClientService } from '../services/api-client.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface DecodedToken {
  exp: number; // Expiration timestamp (seconds since epoch)
  [key: string]: any; // Other JWT claims
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private apiClient: ApiClientService) {}

  /**
   * Decodes the JWT and calculates the remaining validity time.
   * @param accessToken The JWT access token.
   * @returns Remaining time in milliseconds.
   */
  getRemainingTime(accessToken: string): number {
    const decoded: DecodedToken = jwtDecode(accessToken);
    const expirationTime = decoded.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    return expirationTime - currentTime;
  }

  /**
   * Checks if the access token is close to expiring.
   * @param accessToken The JWT access token.
   * @returns True if the token is close to expiring, false otherwise.
   */
  isTokenExpiringSoon(accessToken: string, threshold: number = 30000): boolean {
    const remainingTime = this.getRemainingTime(accessToken);
    return remainingTime <= threshold; // Less than threshold milliseconds remaining
  }

  /**
   * Refreshes the access token using the refresh token stored in HttpOnly cookies.
   * @returns Observable of the new access token.
   */

  refreshToken(): Observable<string> {
    return this.apiClient.refreshToken().pipe(
        map((response) => {
          sessionStorage.setItem('accessToken', response.access_token); // Store the new access token
          return response.access_token;
        })
      );

}
}
