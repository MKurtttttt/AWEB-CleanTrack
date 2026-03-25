import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notifications-container">
      <!-- Notification Bell Icon -->
      <div class="notification-bell" (click)="toggleDropdown()" [class.has-notifications]="unreadCount > 0">
        <span class="bell-icon">🔔</span>
        <span class="notification-badge" *ngIf="unreadCount > 0">{{ unreadCount }}</span>
      </div>

      <!-- Notifications Dropdown -->
      <div class="notifications-dropdown" [class.show]="showDropdown" *ngIf="showDropdown">
        <div class="notifications-header">
          <h3>Notifications</h3>
          <div class="header-actions">
            <button class="mark-all-read-btn" (click)="markAllAsRead()" *ngIf="unreadCount > 0">
              Mark all as read
            </button>
            <button class="close-dropdown-btn" (click)="closeDropdown()">×</button>
          </div>
        </div>

        <div class="notifications-list" *ngIf="notifications.length > 0; else noNotifications">
          <div 
            class="notification-item" 
            [class.unread]="!notification.read"
            (click)="markAsRead(notification._id)"
            *ngFor="let notification of notifications"
          >
            <div class="notification-icon" [style.background-color]="getNotificationColor(notification.type)">
              <span>{{ getNotificationIcon(notification.type) }}</span>
            </div>
            <div class="notification-content">
              <div class="notification-title">{{ notification.title }}</div>
              <div class="notification-message">{{ notification.message }}</div>
              <div class="notification-time">{{ formatTime(notification.createdAt) }}</div>
            </div>
            <div class="notification-actions">
              <button class="delete-btn" (click)="deleteNotification(notification._id, $event)">🗑️</button>
            </div>
          </div>
        </div>

        <ng-template #noNotifications>
          <div class="no-notifications">
            <span class="no-notifications-icon">📭</span>
            <p>No notifications</p>
          </div>
        </ng-template>

        <div class="notifications-footer" *ngIf="notifications.length > 0">
          <button class="load-more-btn" (click)="loadMore()" *ngIf="hasMore">
            Load more...
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notifications-container {
      position: relative;
      display: inline-block;
    }

    .notification-bell {
      position: relative;
      cursor: pointer;
      padding: 8px;
      border-radius: 50%;
      transition: background-color 0.2s;
    }

    .notification-bell:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }

    .bell-icon {
      font-size: 1.5rem;
    }

    .notification-badge {
      position: absolute;
      top: 0;
      right: 0;
      background-color: #e74c3c;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: bold;
    }

    .has-notifications .bell-icon {
      animation: ring 1s ease-in-out;
    }

    @keyframes ring {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(10deg); }
      75% { transform: rotate(-10deg); }
    }

    .notifications-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      width: 350px;
      max-height: 400px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      overflow: hidden;
      margin-top: 8px;
    }

    .notifications-header {
      padding: 16px;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .notifications-header h3 {
      margin: 0;
      font-size: 1.1rem;
      color: #2c3e50;
    }

    .header-actions {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .mark-all-read-btn {
      background: none;
      border: none;
      color: #3498db;
      cursor: pointer;
      font-size: 0.875rem;
      padding: 4px 8px;
      border-radius: 4px;
      transition: background-color 0.2s;
    }

    .mark-all-read-btn:hover {
      background-color: rgba(52, 152, 219, 0.1);
    }

    .close-dropdown-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #7f8c8d;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background-color 0.2s;
    }

    .close-dropdown-btn:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }

    .notifications-list {
      max-height: 300px;
      overflow-y: auto;
    }

    .notification-item {
      padding: 12px 16px;
      border-bottom: 1px solid #f5f5f5;
      display: flex;
      gap: 12px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .notification-item:hover {
      background-color: #f8f9fa;
    }

    .notification-item.unread {
      background-color: #e3f2fd;
    }

    .notification-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      flex-shrink: 0;
    }

    .notification-content {
      flex: 1;
      min-width: 0;
    }

    .notification-title {
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 4px;
    }

    .notification-message {
      color: #6c757d;
      font-size: 0.875rem;
      margin-bottom: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .notification-time {
      color: #95a5a6;
      font-size: 0.75rem;
    }

    .notification-actions {
      display: flex;
      align-items: center;
    }

    .delete-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1rem;
      padding: 4px;
      border-radius: 4px;
      transition: background-color 0.2s;
    }

    .delete-btn:hover {
      background-color: rgba(231, 76, 60, 0.1);
    }

    .no-notifications {
      padding: 40px 16px;
      text-align: center;
      color: #95a5a6;
    }

    .no-notifications-icon {
      font-size: 3rem;
      display: block;
      margin-bottom: 8px;
    }

    .notifications-footer {
      padding: 12px 16px;
      border-top: 1px solid #eee;
      text-align: center;
    }

    .load-more-btn {
      background: none;
      border: 1px solid #3498db;
      color: #3498db;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .load-more-btn:hover {
      background-color: #3498db;
      color: white;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .notifications-dropdown {
        width: 300px;
        right: -50px;
      }
    }
  `]
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  unreadCount = 0;
  showDropdown = false;
  currentPage = 1;
  hasMore = false;
  private subscriptions: Subscription[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadNotifications();
    
    // Subscribe to unread count updates
    this.subscriptions.push(
      this.notificationService.unreadCount$.subscribe(count => {
        this.unreadCount = count;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadNotifications(): void {
    this.notificationService.getNotifications(this.currentPage).subscribe({
      next: (response) => {
        if (this.currentPage === 1) {
          this.notifications = response.notifications;
        } else {
          this.notifications.push(...response.notifications);
        }
        this.hasMore = response.pagination.page < response.pagination.pages;
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
      }
    });
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
    if (this.showDropdown && this.notifications.length === 0) {
      this.loadNotifications();
    }
  }

  closeDropdown(): void {
    this.showDropdown = false;
  }

  markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n._id === notificationId);
    if (notification && !notification.read) {
      this.notificationService.markAsRead(notificationId).subscribe({
        next: () => {
          notification.read = true;
        },
        error: (error) => {
          console.error('Error marking notification as read:', error);
        }
      });
    }
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.forEach(n => n.read = true);
      },
      error: (error) => {
        console.error('Error marking all notifications as read:', error);
      }
    });
  }

  deleteNotification(notificationId: string, event: Event): void {
    event.stopPropagation();
    
    this.notificationService.deleteNotification(notificationId).subscribe({
      next: () => {
        this.notifications = this.notifications.filter(n => n._id !== notificationId);
      },
      error: (error) => {
        console.error('Error deleting notification:', error);
      }
    });
  }

  loadMore(): void {
    this.currentPage++;
    this.loadNotifications();
  }

  getNotificationIcon(type: string): string {
    return this.notificationService.getNotificationIcon(type);
  }

  getNotificationColor(type: string): string {
    return this.notificationService.getNotificationColor(type);
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.notifications-container')) {
      this.closeDropdown();
    }
  }
}
