import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ChatbotComponent } from './pages/chatbot/chatbot.component';
import { ProfileUpdateComponent } from './profile-update/profile-update.component';

export const routes: Routes = [
  { path: '', component: LoginComponent }, // Default route: Login screen
  { path: 'chatbot', component: ChatbotComponent }, // Chatbot screen
 // { path: '**', redirectTo: '' }, // Redirect unknown routes to login
  //{ path: '**', redirectTo: '', pathMatch: 'full' },
  { path: 'profile-update', component: ProfileUpdateComponent }
];
