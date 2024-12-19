import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StateManagerService {
  private chatHistory: any[] = [];
  private isLoggedIn = false;
  private _username: string = '';

  setChatHistory(history: any[]): void {
    this.chatHistory = history;
  }

  getChatHistory(): any[] {
    return this.chatHistory;
  }

  setLoggedIn(status: boolean): void {
    this.isLoggedIn = status;
  }

  isUserLoggedIn(): boolean {
    return this.isLoggedIn;
  }


  set username(name: string) {
    this._username = name;
  }

  get username(): string {
    return this._username;
  }
}
