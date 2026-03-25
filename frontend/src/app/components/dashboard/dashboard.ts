import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../services/report';
import { WasteReport, ReportStatus, WasteCategory } from '../../models/waste-report.model';
import { AuthService } from '../../services/auth.service';
import { NotificationService, AppNotification } from '../../services/notification';
import { RealtimeService } from '../../services/realtime.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit, OnDestroy {
  reports: WasteReport[] = [];
  stats = {
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    urgent: 0
  };
  currentUser: any;
  isAdmin = false;
  private refreshSubscription: Subscription | null = null;
  lastUpdated = new Date();
  previousStats: any = {};

  constructor(
    private reportService: ReportService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private realtimeService: RealtimeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.isAdmin = this.currentUser?.role === 'ADMIN' || 
                   this.currentUser?.role === 'BARANGAY_OFFICIAL' ||
                   this.currentUser?.role === 'WASTE_MANAGEMENT';
    
    console.log('Current user:', this.currentUser);
    console.log('Is admin:', this.isAdmin);
    
    // Wait a bit for token to be properly stored before making API calls
    setTimeout(() => {
      this.loadReports();
      this.loadNotifications();
    }, 100);
    
    // Connect to real-time updates
    this.realtimeService.connectToRealtimeUpdates();
    
    // Subscribe to real-time notifications
    this.realtimeService.notifications$.subscribe(notification => {
      console.log('Real-time notification received:', notification);
      // Just log the notification - no badge needed since we removed the bell
    });
    
    // Subscribe to real-time report updates
    this.realtimeService.reportUpdates$.subscribe(update => {
      console.log('Real-time report update received:', update);
      // Refresh reports when there's an update
      this.loadReports();
    });
    
    // Set up auto-refresh every 30 seconds
    this.refreshSubscription = interval(30000).subscribe(() => {
      this.loadReports();
      this.loadNotifications();
    });
  }

  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
    
    // Disconnect from real-time updates
    this.realtimeService.disconnect();
  }

  loadReports() {
    if (this.isAdmin) {
      // Load admin dashboard data
      this.reportService.getAdminDashboard().subscribe({
        next: (data) => {
          console.log('Admin dashboard data:', data);
          console.log('Data structure:', JSON.stringify(data, null, 2));
          this.previousStats = { ...this.stats };
          // Normalize reports to ensure proper id mapping
          this.reports = (data.reports || []).map((report: any) => this.normalizeReport(report));
          
          // Check if stats are nested or direct
          const statsData = data.stats || data;
          console.log('Stats data being used:', statsData);
          
          // Use backend stats directly since they're correct
          this.stats = {
            total: statsData.total || 0,
            pending: statsData.pending || 0,
            inProgress: statsData.inProgress || 0,
            resolved: statsData.resolved || 0,
            urgent: statsData.urgent || 0
          };
          
          console.log('Final dashboard stats:', this.stats);
          console.log('Dashboard stats:', this.stats);
          console.log('Reports count:', this.reports.length);
          
          // Force change detection
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading admin dashboard:', error);
        }
      });
    } else {
      // Load resident reports
      this.reportService.getReports().subscribe({
        next: (data) => {
          this.previousStats = { ...this.stats };
          this.reports = data;
          this.calculateStats();
          this.lastUpdated = new Date();
        },
        error: (error) => {
          console.error('Error loading reports:', error);
        }
      });
    }
  }

  calculateStats() {
    this.stats = {
      total: this.reports.length,
      pending: this.reports.filter(r => r.status === 'PENDING').length,
      inProgress: this.reports.filter(r => r.status === 'IN_PROGRESS').length,
      resolved: this.reports.filter(r => r.status === 'RESOLVED').length,
      urgent: this.reports.filter(r => r.priority === 'URGENT').length
    };
  }

  loadNotifications() {
    this.notificationService.getNotifications().subscribe({
      next: (notifications) => {
        console.log('Notifications loaded:', notifications.length);
        // Just log notifications - no unread count needed since we removed the bell
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
      }
    });
  }

  getStatusDisplayName(status: ReportStatus): string {
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }

  getStatusClass(status: ReportStatus): string {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('pending')) return 'status-pending';
    if (statusLower.includes('progress')) return 'status-in-progress';
    if (statusLower.includes('resolved')) return 'status-resolved';
    if (statusLower.includes('rejected')) return 'status-rejected';
    return '';
  }

  getPriorityClass(priority: string): string {
    const priorityLower = priority.toLowerCase();
    if (priorityLower.includes('urgent')) return 'priority-urgent';
    if (priorityLower.includes('high')) return 'priority-high';
    if (priorityLower.includes('medium')) return 'priority-medium';
    if (priorityLower.includes('low')) return 'priority-low';
    return '';
  }

  getCategoryDisplayName(category: WasteCategory): string {
    return category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }

  getTrendClass(statType: string): string {
    const current = this.stats[statType as keyof typeof this.stats] || 0;
    const previous = this.previousStats[statType] || 0;
    if (current > previous) return 'trend-up';
    if (current < previous) return 'trend-down';
    return 'trend-neutral';
  }

  getTrendIcon(statType: string): string {
    const trend = this.getTrendClass(statType);
    if (trend === 'trend-up') return '';
    if (trend === 'trend-down') return '';
    return '';
  }

  getChangeClass(statType: string): string {
    const trend = this.getTrendClass(statType);
    if (trend === 'trend-up') return 'change-positive';
    if (trend === 'trend-down') return 'change-negative';
    return 'change-neutral';
  }

  getChangeText(statType: string): string {
    const current = this.stats[statType as keyof typeof this.stats] || 0;
    const previous = this.previousStats[statType] || 0;
    const change = current - previous;
    if (change > 0) return `+${change}`;
    if (change < 0) return `${change}`;
    return '0';
  }

  // Admin status update methods
  updateReportStatus(reportId: string, newStatus: ReportStatus) {
    console.log(`Updating report ${reportId} to status: ${newStatus}`);
    console.log('Current reports:', this.reports.map(r => ({ id: r.id, title: r.title })));
    console.log('Report object being updated:', this.reports.find(r => r.id === reportId));
    
    this.reportService.updateReportStatus(reportId, newStatus).subscribe({
      next: (response) => {
        console.log(`Report ${reportId} status updated to:`, newStatus);
        console.log('API response:', response);
        // Show success message
        alert(`Report marked as ${newStatus.replace('_', ' ').toLowerCase()} successfully!`);
        
        // Refresh reports to show updated status
        this.loadReports();
        
        // Auto-notify resident if marked as resolved
        if (newStatus === ReportStatus.RESOLVED) {
          const report = this.reports.find(r => r.id === reportId);
          if (report) {
            console.log(`Report "${report.title}" marked as resolved`);
          }
        }
      },
      error: (error) => {
        console.error('Error updating report status:', error);
        console.error('Error details:', error.status, error.error, error.message);
        alert('Error updating report status. Please try again.');
      }
    });
  }

  private normalizeReport(report: any): WasteReport {
    return {
      id: report._id || report.id,
      title: report.title,
      description: report.description,
      category: report.category,
      status: report.status,
      location: {
        latitude: report.location?.latitude,
        longitude: report.location?.longitude,
        address: report.location?.address,
        barangay: report.location?.barangay,
        city: report.location?.city
      },
      imageUrl: report.imageUrl || undefined,
      reportedBy:
        typeof report.reportedBy === 'object'
          ? (report.reportedBy?.name || report.reportedBy?.email || 'Unknown')
          : report.reportedBy,
      reportedAt: new Date(report.createdAt || report.reportedAt || Date.now()),
      updatedAt: new Date(report.updatedAt || Date.now()),
      assignedTo:
        typeof report.assignedTo === 'object'
          ? (report.assignedTo?.name || report.assignedTo?._id)
          : report.assignedTo,
      estimatedResolution: report.estimatedResolution ? new Date(report.estimatedResolution) : undefined,
      priority: (report.priority || 'MEDIUM') as any
    };
  }

  markAsDone(report: WasteReport) {
    if (confirm(`Mark "${report.title}" as done? This will notify the reporter and ALL residents about the resolution.`)) {
      // Update status to RESOLVED - backend will automatically send notification
      this.updateReportStatus(report.id, ReportStatus.RESOLVED);
      
      // Show success feedback
      alert(`✅ "${report.title}" marked as done! Notification sent to the reporter and all residents.`);
    }
  }

  // Bulk action methods
  bulkMarkAsResolved() {
    const pendingReports = this.reports.filter(r => r.status === 'PENDING');
    if (pendingReports.length === 0) {
      alert('No pending reports to resolve.');
      return;
    }

    if (confirm(`Resolve all ${pendingReports.length} pending reports? This will notify the reporters and ALL residents about the resolutions.`)) {
      let completed = 0;
      let errors = 0;

      pendingReports.forEach(report => {
        this.updateReportStatus(report.id, ReportStatus.RESOLVED);
        completed++;
      });

      alert(`Bulk action completed! ${completed} reports marked as resolved. Notifications sent to reporters and all residents.`);
    }
  }

  notifyAllResidents() {
    const pendingReports = this.reports.filter(r => r.status === 'PENDING' || r.status === 'IN_PROGRESS');
    if (pendingReports.length === 0) {
      alert('No active reports to notify residents about.');
      return;
    }

    const message = prompt('Enter message to send to all residents with active reports:', 
      'Update on your waste management report: We are actively working on resolving your reported issues. Thank you for your patience!');
    
    if (message) {
      console.log('Bulk notification would be sent to residents:', message);
      alert(`Bulk notification prepared for ${pendingReports.length} residents.`);
    }
  }

  notifyResident(report: WasteReport) {
    const message = prompt('Enter notification message for resident:', `Your report "${report.title}" has been updated. Thank you for helping keep Malabanias clean!`);
    
    if (message) {
      console.log('Notification would be sent to resident:', message);
      alert(`Notification prepared for resident regarding "${report.title}".`);
    }
  }

  getStatusColor(status: ReportStatus): string {
    switch (status) {
      case ReportStatus.PENDING: return '#f39c12';
      case ReportStatus.ASSIGNED: return '#3498db';
      case ReportStatus.IN_PROGRESS: return '#9b59b6';
      case ReportStatus.RESOLVED: return '#27ae60';
      case ReportStatus.REJECTED: return '#e74c3c';
      default: return '#95a5a6';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'URGENT': return '#e74c3c';
      case 'HIGH': return '#f39c12';
      case 'MEDIUM': return '#3498db';
      case 'LOW': return '#27ae60';
      default: return '#95a5a6';
    }
  }
}
