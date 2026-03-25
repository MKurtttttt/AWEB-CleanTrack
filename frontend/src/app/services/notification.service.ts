import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'NEW_REPORT' | 'STATUS_UPDATE' | 'ASSIGNMENT' | 'RESOLUTION' | 'URGENT_ALERT';
  read: boolean;
  reportId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationResponse {
  notifications: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  unreadCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:5000/api/notifications';
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    // Check for new notifications periodically
    this.checkUnreadCount();
    setInterval(() => this.checkUnreadCount(), 30000); // Check every 30 seconds
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getNotifications(page: number = 1, limit: number = 20): Observable<NotificationResponse> {
    return this.http.get<NotificationResponse>(`${this.apiUrl}?page=${page}&limit=${limit}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(response => {
        this.unreadCountSubject.next(response.unreadCount);
      })
    );
  }

  getUnreadCount(): Observable<{ unreadCount: number }> {
    return this.http.get<{ unreadCount: number }>(`${this.apiUrl}/unread-count`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(response => {
        this.unreadCountSubject.next(response.unreadCount);
      })
    );
  }

  markAsRead(notificationId: string): Observable<Notification> {
    return this.http.patch<Notification>(`${this.apiUrl}/${notificationId}/read`, {}, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => {
        // Decrease unread count by 1
        const currentCount = this.unreadCountSubject.value;
        this.unreadCountSubject.next(Math.max(0, currentCount - 1));
      })
    );
  }

  markAllAsRead(): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.apiUrl}/mark-all-read`, {}, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => {
        this.unreadCountSubject.next(0);
      })
    );
  }

  deleteNotification(notificationId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${notificationId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => {
        // Refresh unread count
        this.checkUnreadCount();
      })
    );
  }

  private checkUnreadCount(): void {
    this.getUnreadCount().subscribe({
      next: (response) => {
        this.unreadCountSubject.next(response.unreadCount);
      },
      error: (error) => {
        console.error('Error checking unread count:', error);
      }
    });
  }

  // Helper method to get notification icon based on type
  getNotificationIcon(type: string): string {
    switch (type) {
      case 'NEW_REPORT':
        return '📝';
      case 'STATUS_UPDATE':
        return '🔄';
      case 'ASSIGNMENT':
        return '👤';
      case 'RESOLUTION':
        return '✅';
      case 'URGENT_ALERT':
        return '🚨';
      default:
        return '📢';
    }
  }

  // Helper method to get notification color based on type
  getNotificationColor(type: string): string {
    switch (type) {
      case 'NEW_REPORT':
        return '#3498db'; // Blue
      case 'STATUS_UPDATE':
        return '#f39c12'; // Orange
      case 'ASSIGNMENT':
        return '#9b59b6'; // Purple
      case 'RESOLUTION':
        return '#27ae60'; // Green
      case 'URGENT_ALERT':
        return '#e74c3c'; // Red
      default:
        return '#95a5a6'; // Gray
    }
  }
}
