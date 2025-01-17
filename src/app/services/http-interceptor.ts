import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { switchMap } from 'rxjs/operators';

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const accessToken = sessionStorage.getItem('accessToken');
  //console.log('In service TokenInterceptor'); 

  if (accessToken && authService.isTokenExpiringSoon(accessToken)) {
    return authService.refreshToken().pipe(
      switchMap((newToken) => {
        const clonedRequest = req.clone({
          setHeaders: { Authorization: `Bearer ${newToken}` },
        });
        return next(clonedRequest);
      })
    );
  }

  if (accessToken) {
    const clonedRequest = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` },
    });
    return next(clonedRequest);
  }

  return next(req);
};
