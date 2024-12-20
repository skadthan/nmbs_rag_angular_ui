import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppMenuComponent } from '../app-menu/app-menu.component';

@Component({
  selector: 'app-admin-configuration',
  templateUrl: './admin-config.component.html',
  styleUrls: ['./admin-config.component.scss'],
  imports: [CommonModule, FormsModule,AppMenuComponent ],
})
export class AdminConfigurationComponent {
  modelSettings = {
    modelName: 'GPT-4',
    modelId: '',
    temperature: 0.7,
    topP: 0.9,
  };

  modelOptions = ['GPT-3.5', 'GPT-4', 'Custom'];

  constructor(private router: Router) {}

  navigateBack(): void {
    this.router.navigate(['/chatbot']);
  }

  saveChanges(): void {
    console.log('Settings saved:', this.modelSettings);
    // Implement your save logic here
    alert('Settings saved successfully!');
  }
}
