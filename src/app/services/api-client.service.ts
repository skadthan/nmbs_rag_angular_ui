import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiClientService {
  private baseUrl = 'http://localhost:8000/nmbs/api';

  constructor(private http: HttpClient) {}

  fetchResponse(query: string, token: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/chat/ask`,
      { query },
      { headers: this.getHeaders(token) }
    );
  }

  fetchChatHistory(sessionId: string, token: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/session/getchathistory`,
      { user_session_id: sessionId },
      { headers: this.getHeaders(token) }
    );
  }

  authenticate(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, {
      username,
      password,
    });
  }

  fetchIamUserID(): Observable<any>{
    return this.http.get(
      `${this.baseUrl}/iam/getiamuserid`
    )
  }

  fetchIamUserName(): Observable<any>{
    return this.http.get(
      `${this.baseUrl}/iam/getiamusername`
    )
  }
  private getHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }
}
