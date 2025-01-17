import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root',
})
export class ApiClientService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {
    //console.log("http: ",http);
  }

  fetchResponse(query: string, token: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/chat/ask`,
      { query },
      { headers: this.getHeaders(token) }
    );
  }

  fetchContextualResponse(sessionId: string, query: string, token: string): Observable<any> {
    const payload = {
      session_id: sessionId,
      query: query
    };
    console.log("fetchContextualResponse: payload", payload);
    console.log("accessToken: payload", token);
    return this.http.post(
      `${this.baseUrl}/chat/contextualbot`,payload, { headers: this.getHeaders(token) }
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

  createChatSession(userId: string, sessionId: string, token: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/session/create`,
      { userid: userId,
        sessionId: sessionId 
       },
      { headers: this.getHeaders(token) }
    );
  }

  getUserChatSessions(userId: string, token: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/session/getuserchatsessions`,
      { userid: userId },
      { headers: this.getHeaders(token) }
    );
  }

  fetchUserRoles(userId: string, token: string): Observable<any>{
    return this.http.get(
      `${this.baseUrl}/user/get-user-roles?user_id=${userId}`,
      { headers: this.getHeaders(token) }
    )
  }

  fetchUser(userId: string, token: string): Observable<any>{
    return this.http.get(
      `${this.baseUrl}/user/get-profile?user_id=${userId}`,
      { headers: this.getHeaders(token) }
    )
  }

  fetchAiApplications(token: string): Observable<any>{
    return this.http.get(
      `${this.baseUrl}/config/ge-ai-apps`,
      { headers: this.getHeaders(token) }
    )
  }

  fetchAIAppConfig(application_id: string, token: string): Observable<any>{
    return this.http.get(
      `${this.baseUrl}/config/get-ai-app-config?application_id=${application_id}`,
      { headers: this.getHeaders(token) }
    )
  }
  
  
}
