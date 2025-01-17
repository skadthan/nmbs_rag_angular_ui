import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppMenuComponent } from '../app-menu/app-menu.component';
import { ApiClientService } from '../../services/api-client.service';


interface AIApplication {
  ApplicationId: string;
  ApplicationName: string;
}

@Component({
  selector: 'app-admin-configuration',
  templateUrl: './admin-config.component.html',
  styleUrls: ['./admin-config.component.scss'],
  imports: [CommonModule, FormsModule,AppMenuComponent ],
})
export class AdminConfigurationComponent implements OnInit{

  aiApplications: AIApplication[] = []; // List of AI applications
  selectedApplicationId: string = '';
  currentConfig: any = null;
  token = '';

  ngOnInit(): void {
   
    this.token = sessionStorage.getItem('accessToken') || '';
    this.fetchAIApplications(this.token);
  }
  modelSettings = {
    modelName: 'GPT-4',
    modelId: '',
    temperature: 0.7,
    topP: 0.9,
  };

  modelOptions = ['GPT-3.5', 'GPT-4', 'Custom'];

  constructor(private router: Router,private apiService: ApiClientService,) {}

  navigateBack(): void {
    this.router.navigate(['/chatbot']);
  }

  saveChanges(): void {
    console.log('Settings saved:', this.modelSettings);
    // Implement your save logic here
    alert('Settings saved successfully!');
  }

  // Fetch all AI applications
  fetchAIApplications(token: string) {

    this.apiService.fetchAiApplications(token).subscribe(
      (response: any) => {
        this.aiApplications = response;
      if (this.aiApplications.length > 0) {
        this.selectedApplicationId = this.aiApplications[0].ApplicationId;
        this.fetchAIApplicationConfig(this.selectedApplicationId, token);
      }
      },
      (error) => {
        console.error('Error fetching AI Applications:', error);
      }
    );
  }

  // Fetch configuration for the selected AI application
  fetchAIApplicationConfig(applicationId: string, token: string) {

    this.apiService.fetchAIAppConfig(applicationId, token).subscribe((config: any) => {
        this.currentConfig = config;
      },
      (error)=>{
        console.error('Error fetching AI App Config:', error);
      });
    }

     // Handle application change from dropdown
  onApplicationChange(event: any) {
    this.fetchAIApplicationConfig(this.selectedApplicationId, this.token);
  }

// Save the updated configuration
saveConfiguration() {
  /*
  this.http
    .put(
      `/api/ai-applications/${this.selectedApplicationId}/config`,
      this.currentConfig
    )
    .subscribe(
      () => {
        alert('Configuration saved successfully!');
      },
      (error) => {
        alert('Error saving configuration: ' + error.message);
      }
    );
    */
}
  
}
