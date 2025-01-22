import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ChatbotComponent } from './pages/chatbot/chatbot.component';
import { ProfileUpdateComponent } from './pages/profile-update/profile-update.component';

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
  { path: 'profile-update', loadComponent: () => import('./pages/profile-update/profile-update.component').then(m => m.ProfileUpdateComponent), canActivate: [AuthGuard] },
  { path: 'role-update', loadComponent: () => import('./pages/role-update/role-update.component').then(m => m.RoleUpdateComponent), canActivate: [AuthGuard] },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'admin-config',loadComponent:() => import('./pages/admin-config/admin-config.component').then(m=>m.AdminConfigurationComponent), canActivate: [AuthGuard] },
  { path: 'health', loadComponent:() =>  import('../app/health/health.component').then(m=>m.HealthComponent) },
  { path: '**', redirectTo: '/login' },
];