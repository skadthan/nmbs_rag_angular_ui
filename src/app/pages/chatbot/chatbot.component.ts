import { Component, OnInit, ElementRef, ViewChild  } from '@angular/core';
import { ApiClientService } from '../../services/api-client.service';
import { StateManagerService } from '../../utils/state-manager.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { response } from 'express';
import { LineBreakPipe } from '../../line-break.pipe';
import { RouterModule } from '@angular/router';
import {AppMenuComponent} from '../../app-menu/app-menu.component'


@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, // Ensure FormsModule is explicitly included here
    LineBreakPipe,
    RouterModule,
    AppMenuComponent

  ],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
})
export class ChatbotComponent implements OnInit {
  @ViewChild('chatBox') private chatBox: ElementRef | null = null;
  messages: { role: string; content: string }[] = [];
  userInput: string = '';
  iamusername: string ='';
  username: string='';
  model_name: string = 'Clade Sonnet'
  errorMessage: string = '';

  constructor(
    private apiService: ApiClientService,
    private stateManager: StateManagerService
  ) {}

  ngOnInit(): void {
    const token = sessionStorage.getItem('refreshToken') || '';
    const sessionId = 'AIDAVD6I7NJDQGF3ZCQ3T';
    this.loadChatHistory(sessionId,token);
    this.username = this.stateManager.username || 'Suresh';
    /*
    const token = sessionStorage.getItem('refreshToken') || '';
    const sessionId = 'AIDAVD6I7NJDQGF3ZCQ3T';
    this.apiService.fetchChatHistory(sessionId, token).subscribe((history) => {
      this.messages = history;
      this.stateManager.setChatHistory(history);
    });
    */
  }

  ngAfterViewInit() {
    // Ensure chat box is scrolled to the bottom when the component loads
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    // Keep scrolling as new messages are added
    this.scrollToBottom();
  }
  getUserName(sessionId: string,token: string) {
    this.apiService.fetchIamUserName().subscribe(
      (response) => {
        this.iamusername = response.iam_username
      },
      () => (this.errorMessage = 'API error when fetching the IAM user name.')
    );
  }

  loadChatHistory(sessionId: string,token: string) {
    this.apiService.fetchChatHistory(sessionId,token).subscribe(
      (response: any) => {
        // Map the API response to the format used in the chat interface
        this.messages = response.messages.map((message: any) => ({
          role: message.type === 'human' ? 'user' : 'bot', // Map 'type' to 'role'
          content: message.content, // Use 'content' directly
        }));
      },
      (error) => {
        console.error('Error fetching chat history:', error);
      }
    );
  }

  sendMessage(): void {
    const token = sessionStorage.getItem('refreshToken') || '';
    this.apiService.fetchResponse(this.userInput, token).subscribe((response) => {
      this.messages.push({ role: 'user', content: this.userInput });
      this.messages.push({ role: 'bot', content: response.aiResponse });
      this.userInput = '';

      // Mock bot response
      setTimeout(() => {
        this.messages.push({ role: 'bot', content: 'This is a bot response.' });
        this.scrollToBottom();
      }, 500);
    });
  }

  scrollToBottom() {
    
    if (this.chatBox) {
      this.chatBox.nativeElement.scrollTo({
        top: this.chatBox.nativeElement.scrollHeight,
        behavior: 'smooth',
      });
    }
  }
}


  