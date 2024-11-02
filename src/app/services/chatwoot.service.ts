import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatwootService {
  private baseUrl = 'https://app.chatwoot.com/api/v1';
  private apiToken = 'YOUR_API_ACCESS_TOKEN';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${this.apiToken}`
  });

  constructor(private http: HttpClient) {}

  getConversations(): Observable<any> {
    return this.http.get(`${this.baseUrl}/accounts/YOUR_ACCOUNT_ID/conversations`, { headers: this.headers });
  }

  getMessages(conversationId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/accounts/YOUR_ACCOUNT_ID/conversations/${conversationId}/messages`, { headers: this.headers })
      .pipe(map((data: any) => data.payload.map((msg: any) => ({
        content: msg.content,
        fromUser: msg.message_type === 'outgoing',
        timestamp: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }))));
  }

  sendMessage(conversationId: number, content: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/accounts/YOUR_ACCOUNT_ID/conversations/${conversationId}/messages`,
      { content, message_type: 'outgoing' },
      { headers: this.headers }
    );
  }
}
