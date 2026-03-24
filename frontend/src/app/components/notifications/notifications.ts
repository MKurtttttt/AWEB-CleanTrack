import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, AppNotification } from '../../services/notification';
import { NotificationType } from '../../models/waste-report.model';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-notifications',
  imports: [CommonModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss',
})
export class Notifications implements OnInit, OnDestroy {
  notifications: AppNotification[] = [];
  isLoading = true;
  private refreshSubscription: Subscription | null = null;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.loadNotifications();
    // Set up auto-refresh every 30 seconds
    this.refreshSubscription = interval(30000).subscribe(() => {
      this.loadNotifications();
    });
  }

  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  loadNotifications() {
    this.notificationService.getNotifications().subscribe(data => {
      this.notifications = data;
      this.isLoading = false;
    });
  }

  markAsRead(notificationId: string) {
    this.notificationService.markAsRead(notificationId).subscribe(success => {
      if (success) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
          notification.read = true;
        }
      }
    });
  }

  deleteNotification(notificationId: string) {
    this.notificationService.deleteNotification(notificationId).subscribe(success => {
      if (success) {
        this.notifications = this.notifications.filter(n => n.id !== notificationId);
      }
    });
  }

  getNotificationIcon(type: NotificationType): string {
    switch (type) {
      case 'NEW_REPORT': return '📝';
      case 'STATUS_UPDATE': return '🔄';
      case 'ASSIGNMENT': return '👤';
      case 'RESOLUTION': return '✅';
      case 'URGENT_ALERT': return '🚨';
      default: return '📢';
    }
  }
}
