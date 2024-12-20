import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add any headers if required, like an Authorization header
    const authReq = req.clone({
      setHeaders: {
        // Add an Authorization token if needed
        Authorization: `Bearer ${sessionStorage.getItem('refreshToken') || ''}`
      }
    });

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Handle Unauthorized error (e.g., session expired)
          sessionStorage.clear(); // Clear session storage
          this.router.navigate(['/login']); // Redirect to login
        } else if (error.status === 403) {
          // Handle Forbidden error
          console.error('Access denied:', error.message);
        }

        return throwError(error); // Re-throw the error for further handling if needed
      })
    );
  }
}
