import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ChatbotComponent } from './pages/chatbot/chatbot.component';
import { ProfileUpdateComponent } from './profile-update/profile-update.component';
import { AdminConfigurationComponent } from '../app/admin-config/admin-config.component'

/*
export const routes: Routes = [
  { path: '', component: LoginComponent }, // Default route: Login screen
  { path: 'chatbot', component: ChatbotComponent }, // Chatbot screen
  { path: '**', redirectTo: '' }, // Redirect unknown routes to login
  { path: '**', redirectTo: '', pathMatch: 'full' },
  { path: 'profile-update', component: ProfileUpdateComponent }
];
*/

import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'chatbot', loadComponent: () => import('./pages/chatbot/chatbot.component').then(m => m.ChatbotComponent), canActivate: [AuthGuard] },
  { path: 'profile-update', loadComponent: () => import('../app/profile-update/profile-update.component').then(m => m.ProfileUpdateComponent), canActivate: [AuthGuard] },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'admin-config',loadComponent:() => import('./admin-config/admin-config.component').then(m=>m.AdminConfigurationComponent), canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login' },
];