import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ChatbotComponent } from './pages/chatbot/chatbot.component';
import { ProfileUpdateComponent } from './pages/profile-update/profile-update.component';

const routes: Routes = [
  //{ path: '', component: LoginComponent }, // Default route: Login screen
  //{ path: 'chatbot', component: ChatbotComponent }, // Chatbot screen
 // { path: '**', redirectTo: '' }, // Wildcard route to redirect to login
  { path: 'profile-update', component: ProfileUpdateComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
