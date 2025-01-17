import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  // Add any headers if required, like an Authorization header
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${sessionStorage.getItem('accessToken') || ''}`
    }
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Handle Unauthorized error (e.g., session expired)
        sessionStorage.clear(); // Clear session storage
        router.navigate(['/login']); // Redirect to login
      } else if (error.status === 403) {
        // Handle Forbidden error
        console.error('Access denied:', error.message);
      }

      return throwError(() => error); // Re-throw the error for further handling if needed
    })
  );
};