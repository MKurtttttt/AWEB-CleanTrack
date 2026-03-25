import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AppNotification } from './notification';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RealtimeService {
  private eventSource: EventSource | null = null;
  private notificationSubject = new Subject<AppNotification>();
  private reportUpdateSubject = new Subject<any>();
  
  public notifications$ = this.notificationSubject.asObservable();
  public reportUpdates$ = this.reportUpdateSubject.asObservable();

  constructor(private authService: AuthService) {}

  connectToRealtimeUpdates(): void {
    if (this.eventSource) {
      this.eventSource.close();
    }

    // Get auth token and construct URL with it
    const token = this.authService.getToken();
    const url = `${environment.apiUrl}/events/notifications${token ? `?token=${token}` : ''}`;
    
    console.log('Connecting to SSE:', url);

    this.eventSource = new EventSource(url, {
      withCredentials: true
    });

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('SSE message received:', data);
        
        switch (data.type) {
          case 'notification':
            this.notificationSubject.next(data.payload);
            break;
          case 'report_update':
            this.reportUpdateSubject.next(data.payload);
            break;
        }
      } catch (error) {
        console.error('SSE parsing error:', error);
      }
    };

    this.eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      // Stop reconnecting on 401 errors - auth issue won't be fixed by retrying
      if (error.type === 'error') {
        console.log('SSE connection failed - stopping reconnection attempts');
        // Don't reconnect on auth errors
        return;
      }
    };

    this.eventSource.addEventListener('error', (event) => {
      console.error('SSE error event:', event);
      // Don't auto-reconnect on authentication errors
      if (event.type === 'error') {
        console.log('SSE authentication error - stopping reconnection');
        return;
      }
      setTimeout(() => this.connectToRealtimeUpdates(), 3000);
    });

    this.eventSource.addEventListener('close', () => {
      console.log('SSE connection closed, reconnecting...');
      setTimeout(() => this.connectToRealtimeUpdates(), 3000);
    });
  }

  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}
