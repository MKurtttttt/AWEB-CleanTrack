import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationService, Notification } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-notifications-page">
      <header class="page-header">
        <div class="header-content">
          <div class="header-text">
            <h1>🔔 Notifications</h1>
            <p>View and manage all system notifications</p>
          </div>
          <div class="header-actions">
            <button class="btn-refresh" (click)="refreshNotifications()">
              🔄 Refresh
            </button>
            <button class="btn-mark-all-read" (click)="markAllAsRead()" *ngIf="unreadCount > 0">
              ✅ Mark All as Read
            </button>
          </div>
        </div>
      </header>

      <main class="notifications-content">
        <div class="notifications-stats" *ngIf="notifications.length > 0">
          <div class="stat-card">
            <div class="stat-number">{{ unreadCount }}</div>
            <div class="stat-label">Unread</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ notifications.length }}</div>
            <div class="stat-label">Total</div>
          </div>
        </div>

        <div class="notifications-list" *ngIf="notifications.length > 0; else noNotifications">
          <div 
            class="notification-item" 
            [class.unread]="!notification.read"
            *ngFor="let notification of notifications"
          >
            <div class="notification-icon" [style.background-color]="getNotificationColor(notification.type)">
              <span>{{ getNotificationIcon(notification.type) }}</span>
            </div>
            <div class="notification-content">
              <div class="notification-header">
                <h3 class="notification-title">{{ notification.title }}</h3>
                <div class="notification-meta">
                  <span class="notification-time">{{ formatTime(notification.createdAt) }}</span>
                  <span class="notification-type">{{ notification.type }}</span>
                </div>
              </div>
              <div class="notification-message">{{ notification.message }}</div>
              <div class="notification-actions">
                <button 
                  class="btn-mark-read" 
                  *ngIf="!notification.read"
                  (click)="markAsRead(notification._id)"
                >
                  Mark as Read
                </button>
                <button 
                  class="btn-delete"
                  (click)="deleteNotification(notification._id)"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="load-more-section" *ngIf="hasMore">
          <button class="btn-load-more" (click)="loadMore()" [disabled]="isLoading">
            {{ isLoading ? 'Loading...' : 'Load More' }}
          </button>
        </div>

        <ng-template #noNotifications>
          <div class="empty-state">
            <div class="empty-icon">📭</div>
            <h2>No Notifications</h2>
            <p>You don't have any notifications yet.</p>
            <p>Notifications will appear here when residents submit new waste reports.</p>
          </div>
        </ng-template>
      </main>
    </div>
  `,
  styles: [`
    .admin-notifications-page {
      min-height: 100vh;
      background: #1a1a1a;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #ffffff;
    }

    .page-header {
      background: #2d2d2d;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      padding: 2.5rem 0;
      margin-bottom: 3rem;
      border-bottom: 1px solid #404040;
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 2rem;
    }

    .header-text h1 {
      margin: 0 0 0.5rem 0;
      color: #ffffff;
      font-size: 2.2rem;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    .header-text p {
      margin: 0;
      color: #9ca3af;
      font-size: 1rem;
      font-weight: 400;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
    }

    .btn-refresh, .btn-mark-all-read {
      padding: 0.75rem 1.5rem;
      border: 1px solid transparent;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.2s ease;
      background: #ffffff;
      color: #1a1a1a;
    }

    .btn-refresh:hover {
      background: #f3f4f6;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .btn-mark-all-read {
      background: #4ade80;
      color: white;
      border-color: #4ade80;
    }

    .btn-mark-all-read:hover {
      background: #22c55e;
      border-color: #22c55e;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(34, 197, 94, 0.2);
    }

    .notifications-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem 2rem;
    }

    .notifications-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2.5rem;
    }

    .stat-card {
      background: #2d2d2d;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      text-align: center;
      border: 1px solid #404040;
      transition: all 0.2s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      border-color: #4ade80;
    }

    .stat-number {
      font-size: 2.5rem;
      font-weight: 700;
      color: #4ade80;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      color: #9ca3af;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 500;
    }

    .notifications-list {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .notification-item {
      background: #2d2d2d;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;
      display: flex;
      gap: 1rem;
      transition: all 0.2s ease;
      border: 1px solid #404040;
    }

    .notification-item:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }

    .notification-item.unread {
      background: #1e293b;
      border-color: #4ade80;
    }

    .notification-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      color: white;
      flex-shrink: 0;
    }

    .notification-content {
      flex: 1;
    }

    .notification-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.75rem;
    }

    .notification-title {
      margin: 0;
      color: #ffffff;
      font-size: 1.1rem;
      font-weight: 600;
      line-height: 1.4;
    }

    .notification-meta {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.25rem;
    }

    .notification-time {
      font-size: 0.875rem;
      color: #9ca3af;
      font-weight: 400;
    }

    .notification-type {
      font-size: 0.75rem;
      padding: 0.25rem 0.75rem;
      border-radius: 6px;
      background: rgba(74, 222, 128, 0.15);
      color: #4ade80;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .notification-message {
      color: #e5e7eb;
      line-height: 1.5;
      margin-bottom: 1rem;
      font-size: 0.95rem;
      font-weight: 400;
    }

    .notification-actions {
      display: flex;
      gap: 0.75rem;
    }

    .btn-mark-read, .btn-delete {
      padding: 0.5rem 1rem;
      border: 1px solid transparent;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .btn-mark-read {
      background: #4ade80;
      color: white;
      border-color: #4ade80;
    }

    .btn-mark-read:hover {
      background: #22c55e;
      border-color: #22c55e;
      transform: translateY(-1px);
    }

    .btn-delete {
      background: transparent;
      color: #ef4444;
      border-color: #ef4444;
    }

    .btn-delete:hover {
      background: #ef4444;
      color: white;
    }

    .load-more-section {
      text-align: center;
      margin-top: 2rem;
    }

    .btn-load-more {
      padding: 0.75rem 2rem;
      background: #ffffff;
      color: #1a1a1a;
      border: 1px solid #404040;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.95rem;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .btn-load-more:hover:not(:disabled) {
      background: #f3f4f6;
      border-color: #4ade80;
      transform: translateY(-1px);
    }

    .btn-load-more:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #9ca3af;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1.5rem;
      opacity: 0.3;
    }

    .empty-state h2 {
      margin: 0 0 1rem 0;
      color: #ffffff;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .empty-state p {
      margin: 0.5rem 0;
      max-width: 500px;
      margin-left: auto;
      margin-right: auto;
      font-size: 0.95rem;
      line-height: 1.5;
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 1.5rem;
        text-align: center;
      }

      .header-actions {
        justify-content: center;
        flex-wrap: wrap;
      }

      .notifications-content {
        padding: 0 1rem 2rem;
      }

      .notification-item {
        flex-direction: column;
        gap: 1rem;
        padding: 1.25rem;
      }

      .notification-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
      }

      .notification-meta {
        align-items: flex-start;
      }

      .notification-actions {
        justify-content: center;
        flex-wrap: wrap;
      }

      .notifications-stats {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .stat-card {
        padding: 1.25rem;
      }

      .stat-number {
        font-size: 2rem;
      }
    }
  `]
})
export class AdminNotificationsComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  unreadCount = 0;
  currentPage = 1;
  hasMore = false;
  isLoading = false;
  private subscriptions: Subscription[] = [];

  constructor(private notificationService: NotificationService, private router: Router) {}

  ngOnInit() {
    this.loadNotifications();
    
    // Subscribe to unread count updates
    this.subscriptions.push(
      this.notificationService.unreadCount$.subscribe(count => {
        this.unreadCount = count;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadNotifications() {
    console.log('=== ADMIN NOTIFICATIONS - loadNotifications called ===');
    console.log('Current page:', this.currentPage);
    console.log('Is loading:', this.isLoading);
    
    this.isLoading = true;
    console.log('Making API call to get notifications...');
    
    this.notificationService.getNotifications(this.currentPage).subscribe({
      next: (response) => {
        console.log('=== ADMIN NOTIFICATIONS - API Response ===');
        console.log('Response:', response);
        console.log('Notifications received:', response.notifications?.length || 0);
        
        if (this.currentPage === 1) {
          this.notifications = response.notifications;
        } else {
          this.notifications.push(...response.notifications);
        }
        this.hasMore = response.pagination.page < response.pagination.pages;
        this.isLoading = false;
        
        console.log('Notifications loaded:', this.notifications.length);
        console.log('Has more:', this.hasMore);
      },
      error: (error) => {
        console.error('=== ADMIN NOTIFICATIONS - API Error ===');
        console.error('Error loading notifications:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        this.isLoading = false;
      }
    });
  }

  refreshNotifications() {
    this.currentPage = 1;
    this.loadNotifications();
  }

  markAsRead(notificationId: string) {
    this.notificationService.markAsRead(notificationId).subscribe({
      next: () => {
        // Update local notification
        const notification = this.notifications.find(n => n._id === notificationId);
        if (notification) {
          notification.read = true;
        }
      },
      error: (error) => {
        console.error('Error marking notification as read:', error);
      }
    });
  }

  markAllAsRead() {
    const unreadNotifications = this.notifications.filter(n => !n.read);
    const promises = unreadNotifications.map(n => this.notificationService.markAsRead(n._id));
    
    Promise.all(promises).then(() => {
      // Update local notifications
      this.notifications.forEach(n => n.read = true);
      this.unreadCount = 0;
    }).catch(error => {
      console.error('Error marking all as read:', error);
    });
  }

  deleteNotification(notificationId: string) {
    if (confirm('Are you sure you want to delete this notification?')) {
      this.notificationService.deleteNotification(notificationId).subscribe({
        next: () => {
          // Remove from local notifications
          this.notifications = this.notifications.filter(n => n._id !== notificationId);
          if (this.unreadCount > 0) {
            this.unreadCount--;
          }
        },
        error: (error) => {
          console.error('Error deleting notification:', error);
        }
      });
    }
  }

  loadMore() {
    this.currentPage++;
    this.loadNotifications();
  }

  getNotificationIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'NEW_REPORT': '📝',
      'STATUS_UPDATE': '📊',
      'ASSIGNMENT': '👤',
      'RESOLUTION': '✅',
      'URGENT_ALERT': '🚨'
    };
    return icons[type] || '📢';
  }

  getNotificationColor(type: string): string {
    const colors: { [key: string]: string } = {
      'NEW_REPORT': '#28a745',
      'STATUS_UPDATE': '#17a2b8',
      'ASSIGNMENT': '#ffc107',
      'RESOLUTION': '#28a745',
      'URGENT_ALERT': '#dc3545'
    };
    return colors[type] || '#6c757d';
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return `${Math.floor(diffMins / 1440)} days ago`;
  }
}
