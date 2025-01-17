import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth-service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = sessionStorage.getItem('accessToken');
  
    if (accessToken && this.authService.isTokenExpiringSoon(accessToken)) {
      return this.authService.refreshToken().pipe(
        switchMap((newToken) => {
          const clonedRequest = req.clone({
            setHeaders: { Authorization: `Bearer ${newToken}` },
          });
          return next.handle(clonedRequest);
        })
      );
    }
  
    if (accessToken) {
      const clonedRequest = req.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` },
      });
      return next.handle(clonedRequest);
    }
  
    return next.handle(req);
  }
  
}
