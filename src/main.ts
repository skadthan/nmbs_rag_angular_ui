import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { authConfig } from './app/auth/auth.config';
import { provideAuth } from 'angular-auth-oidc-client';
import { TokenInterceptor } from './app/services/http-interceptor';
import { environment } from './app/environment/environment';
import { enableProdMode } from '@angular/core';

if (environment.production) {
  enableProdMode();
}


bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),   // Provides routing
    provideHttpClient(withInterceptors([TokenInterceptor])), provideAuth(authConfig),     // Provides HttpClient functionality
  ],
}).catch((err) => console.error(err));
