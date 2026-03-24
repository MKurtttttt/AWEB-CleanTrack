import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, map } from 'rxjs';
import { NotificationType } from '../models/waste-report.model';

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: Date;
  reportId?: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly apiUrl = 'http://localhost:5000/api/notifications';
  private notificationSubject = new Subject<AppNotification>();

  constructor(private http: HttpClient) {}

  getNotifications(): Observable<AppNotification[]> {
    return this.http
      .get<any>(this.apiUrl, { headers: this.authHeaders })
      .pipe(map((response) => (response?.notifications || []).map((n: any) => this.normalizeNotification(n))));
  }

  getUnreadNotifications(): Observable<AppNotification[]> {
    return this.getNotifications().pipe(map((items) => items.filter((n) => !n.read)));
  }

  createNotification(
    userId: string,
    title: string,
    message: string,
    type: NotificationType,
    reportId?: string
  ): Observable<AppNotification> {
    const notification: AppNotification = {
      id: Date.now().toString(),
      userId,
      title,
      message,
      type,
      read: false,
      createdAt: new Date(),
      reportId
    };
    this.notificationSubject.next(notification);
    return new Observable((observer) => {
      observer.next(notification);
      observer.complete();
    });
  }

  markAsRead(notificationId: string): Observable<boolean> {
    return this.http
      .patch<any>(`${this.apiUrl}/${notificationId}/read`, {}, { headers: this.authHeaders })
      .pipe(map(() => true));
  }

  markAllAsRead(_userId: string): Observable<boolean> {
    return this.http
      .patch<any>(`${this.apiUrl}/mark-all-read`, {}, { headers: this.authHeaders })
      .pipe(map(() => true));
  }

  deleteNotification(notificationId: string): Observable<boolean> {
    return this.http
      .delete<any>(`${this.apiUrl}/${notificationId}`, { headers: this.authHeaders })
      .pipe(map(() => true));
  }

  getNotificationStream(): Observable<AppNotification> {
    return this.notificationSubject.asObservable();
  }

  private sendRealTimeNotification(notification: AppNotification): void {
    // Mock implementation for real-time notifications
    console.log('New notification:', notification);
    
    // In a real app, this would use WebSocket or Service Worker
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/assets/icons/notification-icon.png'
      });
    }
  }

  private get authHeaders(): HttpHeaders {
    if (typeof localStorage === 'undefined') {
      return new HttpHeaders();
    }
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return new HttpHeaders();
    }
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  private normalizeNotification(notification: any): AppNotification {
    return {
      id: notification._id || notification.id,
      userId: notification.userId,
      title: notification.title,
      message: notification.message,
      type: notification.type as NotificationType,
      read: !!notification.read,
      createdAt: new Date(notification.createdAt || Date.now()),
      reportId: notification.reportId?._id || notification.reportId
    };
  }

  requestNotificationPermission(): Observable<boolean> {
    return new Observable(observer => {
      if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
          observer.next(permission === 'granted');
          observer.complete();
        });
      } else {
        observer.next(false);
        observer.complete();
      }
    });
  }
}
