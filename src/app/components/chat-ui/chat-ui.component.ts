import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chat-ui',
  template: `
    <div class="chat-box">
      <p *ngFor="let message of chatHistory">{{ message.content }}</p>
    </div>
  `,
})
export class ChatUiComponent {
  @Input() chatHistory: any[] = [];
}
