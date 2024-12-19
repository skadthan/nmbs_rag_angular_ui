import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-user-input',
  templateUrl: './user-input.component.html',
  styleUrls: ['./user-input.component.css'],
})
export class UserInputComponent {
  userMessage: string = '';

  @Output() messageSent = new EventEmitter<string>();

  sendMessage(): void {
    if (this.userMessage.trim()) {
      this.messageSent.emit(this.userMessage);
      this.userMessage = '';
    }
  }
}
