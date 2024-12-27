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



interface ChatMessage {
  Role: string;
  Content: string;
  ResponseMetadata?: {
    sources: {
      source: string;
      page_content: string;
    }[];
  };
}

interface Source {
  source: string;
  page_content: string;
}

interface Message {
  role: 'user' | 'bot'; // Restrict role to specific string literals
  content: string;
  sources?: { name: string; content: string; showContent?: boolean }[]; // Add showContent here
  showSources?: boolean; // Add showSources for toggling sources
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
  savedSessionId: string='';
  

  constructor(
    private apiService: ApiClientService,
    private stateManager: StateManagerService
  ) {}

  ngOnInit(): void {
    this.savedSessionId ='';
    this.token = sessionStorage.getItem('refreshToken') || '';
    console.log("this.savedSessionId: ",this.savedSessionId)
    this.loadChatHistory(this.savedSessionId,this.token);
    this.username = sessionStorage.getItem("username") || '';
    this.userId= sessionStorage.getItem("userId") ||'No UserID'
    console.log("My user ID is : ",this.userId)
    this.userId = 'skadthan';
    
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
        console.log("Print ChatHistory: ", response)
        // Map the API response to the format used in the chat interface
        this.messages = response.messages.map((message: any) => ({
          role: message.Role === 'user' ? 'user' : 'bot', // Map 'type' to 'role'
          content: message.Content, // Use 'content' directly
          sources: message.ResponseMetadata?.sources?.map((source: Source) => ({
            name: source.source,
            content: source.page_content,
            showContent: false,
          })) || [],
          tokenCounts: message.ResponseMetadata?.token_counts || {},
          showSources: false
        }));
        console.log("this.messages", this.messages);
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
    const sessionId = sessionStorage.getItem('currentSessionId') || '';
    console.log("token", token);
    console.log("currentSessionId", sessionId);

    // Add the user message to the chat immediately and clear the input box
  this.messages.push({ role: 'user', content: this.userInput });
  

  const userInputBackup = this.userInput; // Backup user input for use in the API call
  this.userInput = ''; // Clear the input box immediately

  // Add a placeholder "thinking" message from the AI
  const thinkingMessage: Message = { role: 'bot', content: 'Thinking...', isTemporary: true };
  this.messages.push(thinkingMessage);
  this.scrollToBottom();
 
  
    this.apiService.fetchContextualResponse(sessionId, userInputBackup, token).subscribe({ 
      next: (response: {status_code: number; messages: ChatMessage[] }) => {
      
        console.log("fetchContextualResponse API Response:", response);
      // Remove the "thinking" message
      this.messages = this.messages.filter((msg) => !msg.isTemporary);

        // Check if the response indicates an error
      if (response.status_code && response.status_code !== 200) {
        this.messages.push({ role: 'bot', content: `Error: ${response.messages}` });
        this.scrollToBottom();
        return;
      }
        else {
          // Normal flow: Add bot's response
          const aiMessage = response.messages.find((msg) => msg.Role === 'ai');
          const botMessage: Message = {
            role: 'bot',
            content: aiMessage?.Content || 'No response received.',
            sources: aiMessage?.ResponseMetadata?.sources?.map((source) => ({
              name: source.source,
              content: source.page_content,
              showContent: false, // Ensure compatibility with UI
            })) || [],
            isTemporary: false,
          };
        this.messages.push(botMessage);
          
        }
        this.scrollToBottom();
      },
      error: (error) => {

        // Remove the "thinking" message
      this.messages = this.messages.filter((msg) => !msg.isTemporary); 
        console.error('Error fetching response:', error);
        this.messages.push({ role: 'bot', content: 'An error occurred while fetching the response. Please try again.' });
      }
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

get hasTemporaryMessage(): boolean {
  return this.messages.some((msg) => msg.isTemporary === true);
}

generateSessionId(): string {
  return Date.now().toString(); // Use a timestamp-based unique ID
}

newChat(): void {
  this.chatSessionId = this.generateSessionId();

  sessionStorage.setItem('currentSessionId', this.chatSessionId); // Save sessionId to local storage

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
  sessionStorage.setItem('currentSessionId', this.chatSessionId); // Save sessionId to local storage
  this.loadChatHistory(this.chatSessionId,this.token)
  console.log('Loaded chat session:', session);
  // Optionally, load chat history for the session
}

toggleSourceContent(source: any): void {
  const chatBox = document.querySelector('.chat-box') as HTMLElement; // Select the chat box
  console.log('Before toggle: toggleSourceContent: ', chatBox.scrollTop);
  source.showContent = !source.showContent;
    // Save the current scroll position
  const scrollTop = chatBox.scrollTop;
  // Restore the scroll position
  // Restore the scroll position
  setTimeout(() => {
    chatBox.scrollTop = scrollTop; // Explicitly reset scroll position
  }, 0);
  console.log('After toggle: toggleSourceContent: ', chatBox.scrollTop);
}

toggleSourceVisibility(message: Message): void {

  const chatBox = document.querySelector('.chat-box') as HTMLElement; // Select the chat box
  console.log('Before toggle: toggleSourceVisibility: ', chatBox.scrollTop);
  // Save the current scroll position
  const scrollTop = chatBox.scrollTop;
  
  if (message.sources) {
    message.showSources = !message.showSources;
  }
  // Restore the scroll position
  // Restore the scroll position
  setTimeout(() => {
    chatBox.scrollTop = scrollTop; // Explicitly reset scroll position
  }, 0);
  console.log('After toggle: toggleSourceVisibility: ', chatBox.scrollTop);
}
}


  