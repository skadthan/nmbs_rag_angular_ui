import { Component, OnInit, ElementRef, ViewChild  } from '@angular/core';
import { ApiClientService } from '../../services/api-client.service';
import { StateManagerService } from '../../utils/state-manager.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { response } from 'express';
import { LineBreakPipe } from '../../line-break.pipe';
import { RouterModule } from '@angular/router';
import {AppMenuComponent} from '../../app-menu/app-menu.component'
import { Token } from '@angular/compiler';


interface Message {
  role: 'user' | 'bot';
  content: string;
  isTemporary?: boolean;
}


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
  //messages: { role: string; content: string }[] = [];
  messages: Message[] = [];
  userInput: string = '';
  iamusername: string ='';
  username: string='';
  model_name: string = 'Clade Sonnet'
  errorMessage: string = '';
  chatSessionId: string = this.generateSessionId();
  userId: string ='';
  previousSessions: { sessionId: string; createdAt: string }[] = []; // Add this property
  token: string='';
  

  constructor(
    private apiService: ApiClientService,
    private stateManager: StateManagerService
  ) {}

  ngOnInit(): void {
    this.token = sessionStorage.getItem('refreshToken') || '';
    const sessionId = 'AIDAVD6I7NJDQGF3ZCQ3T';
    sessionStorage.setItem('sessionId',sessionId)
    //this.loadChatHistory(sessionId,token);
    this.username = this.stateManager.username || 'No User Name';
    this.userId= sessionStorage.getItem("userId") ||'No UserID'
    console.log("My user ID is : ",this.userId)
    this.userId = 'skadthan';


    /*
    const token = sessionStorage.getItem('refreshToken') || '';
    const sessionId = 'AIDAVD6I7NJDQGF3ZCQ3T';
    this.apiService.fetchChatHistory(sessionId, token).subscribe((history) => {
      this.messages = history;
      this.stateManager.setChatHistory(history);
    });
    */
    this.loadUserSessions(this.userId); // Load previous sessions on initialization
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

    if (!this.userInput.trim()) {
      return; // Prevent sending empty messages
    }
    const token = sessionStorage.getItem('refreshToken') || '';
    const sessionId = sessionStorage.getItem('sessionId') || '';

    // Add the user message to the chat immediately and clear the input box
  this.messages.push({ role: 'user', content: this.userInput });
  const userInputBackup = this.userInput; // Backup user input for use in the API call
  this.userInput = ''; // Clear the input box immediately

  // Add a placeholder "thinking" message from the AI
  const thinkingMessage: Message = { role: 'bot', content: 'Thinking...', isTemporary: true };
  this.messages.push(thinkingMessage);
  this.scrollToBottom();
    
    if (!this.userInput.trim()) return; // Avoid sending empty messages
  
    // Add the user's message to the chat
    this.messages.push({ role: 'user', content: this.userInput });
  
    this.apiService.fetchContextualResponse(sessionId, userInputBackup, token).subscribe(
      (response) => {
      
   // Remove the "thinking" message
   this.messages = this.messages.filter((msg) => !msg.isTemporary);

        // Check if the response indicates an error
      if (response.status_code && response.status_code !== 200) {
        this.messages.push({ role: 'bot', content: `Error: ${response.message}` });
        this.scrollToBottom();
        return;
      }
        // Add the AI's response to the chat
       // this.messages.push({ role: 'bot', content: response.answer });

         // Normal flow: Add user input and bot response to messages
       //this.messages.push({ role: 'user', content: this.userInput });
       /*
        this.messages.push({ role: 'bot', content: response.aiResponse });
  
        // Append sources as collapsible items
        response.context.forEach((doc: any) => {
          const sourceLink = `
            <details>
              <summary>${doc.metadata.source}</summary>
              <div>${doc.page_content}</div>
            </details>`;
          this.messages.push({ role: 'bot', content: sourceLink });
        });
  
        this.userInput = ''; // Clear the input box
        this.scrollToBottom(); // Scroll to the latest message

        */

        else {
          // Normal flow: Add bot's response
          this.messages.push({ role: 'bot', content: response.aiResponse });
  
          // Display collapsible links for sources
          if (response.context && response.context.length > 0) {
            const sourceLinks = response.context.map((source: any) => {
              return `<div><a href="javascript:void(0)" (click)="showSource('${source.source}')">${source.source}</a></div>`;
            }).join('');
            this.messages.push({ role: 'bot', content: `Sources:<br>${sourceLinks}` });
          }
        }
        this.scrollToBottom();
      },
      (error) => {

        // Remove the "thinking" message
      this.messages = this.messages.filter((msg) => !msg.isTemporary); 
        console.error('Error fetching response:', error);
        this.messages.push({ role: 'bot', content: 'An error occurred while fetching the response. Please try again.' });
      }
    );
  }
  

  scrollToBottom() {
    
    if (this.chatBox) {
      this.chatBox.nativeElement.scrollTo({
        top: this.chatBox.nativeElement.scrollHeight,
        behavior: 'smooth',
      });
    }
  }
/*
  showSource(source: string): void {
    // Fetch and display the source document content
    this.apiService.fetchSourceContent(source).subscribe((content) => {
      this.messages.push({ role: 'bot', content: `<strong>${source}:</strong><br>${content}` });
      this.scrollToBottom();
    });
  }
*/  

get hasTemporaryMessage(): boolean {
  return this.messages.some((msg) => msg.isTemporary === true);
}

generateSessionId(): string {
  return Date.now().toString(); // Use a timestamp-based unique ID
}

newChat(): void {
  this.chatSessionId = this.generateSessionId();

  const token = sessionStorage.getItem('refreshToken') || '';

  this.messages = []; // Clear the chatbox
  this.apiService.createChatSession(this.userId, this.chatSessionId,token).subscribe(
    () => {
      console.log('New chat session created:', this.chatSessionId);
    },
    (error) => {
      console.error('Failed to create a new chat session', error);
    }
  );
}

loadUserSessions(userId: string): void {

  const token = sessionStorage.getItem('refreshToken') || '';


  this.apiService.getUserChatSessions(userId, token).subscribe(
    (response) => {
      // Map response to a more user-friendly format if needed
      this.previousSessions = response.map((session: any) => ({
        sessionId: session.SessionId,
        createdAt: session.createdAt,
      }));
      console.log("previousSessions", this.previousSessions)
    },
    (error) => {
      console.error('Failed to load user sessions:', error);
    }
  );

}

// Handle loading an existing chat session
loadChatSession(session: { sessionId: string; createdAt: string }): void {
  this.chatSessionId = session.sessionId; // Set the current session ID
  this.messages = []; // Clear messages (optional)
  this.loadChatHistory(this.chatSessionId,this.token)
  console.log('Loaded chat session:', session);
  // Optionally, load chat history for the session
}

}


  