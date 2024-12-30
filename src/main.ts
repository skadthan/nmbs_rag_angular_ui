import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { authConfig } from './app/auth/auth.config';
import { provideAuth } from 'angular-auth-oidc-client';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),   // Provides routing
    provideHttpClient(), provideAuth(authConfig),     // Provides HttpClient functionality
  ],
}).catch((err) => console.error(err));
