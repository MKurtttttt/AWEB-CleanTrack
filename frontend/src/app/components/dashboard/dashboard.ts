import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../services/report';
import { WasteReport, ReportStatus, WasteCategory } from '../../models/waste-report.model';
import { AuthService } from '../../services/auth.service';
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

  constructor(
    private reportService: ReportService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.isAdmin = this.currentUser?.role === 'ADMIN' || this.currentUser?.role === 'BARANGAY_OFFICIAL';
    this.loadReports();
    // Set up auto-refresh every 30 seconds for real-time updates
    this.refreshSubscription = interval(30000).subscribe(() => {
      this.loadReports();
    });
  }

  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  loadReports() {
    if (this.isAdmin) {
      // Load admin dashboard data
      this.reportService.getAdminDashboard().subscribe(data => {
        this.reports = data.recentReports || [];
        this.stats = data.stats || this.stats;
      });
    } else {
      // Load resident reports
      this.reportService.getReports().subscribe(data => {
        this.reports = data;
        this.calculateStats();
      });
    }
  }

  calculateStats() {
    this.stats.total = this.reports.length;
    this.stats.pending = this.reports.filter(r => r.status === ReportStatus.PENDING).length;
    this.stats.inProgress = this.reports.filter(r => r.status === ReportStatus.IN_PROGRESS).length;
    this.stats.resolved = this.reports.filter(r => r.status === ReportStatus.RESOLVED).length;
    this.stats.urgent = this.reports.filter(r => r.priority === 'URGENT').length;
  }

  getStatusDisplayName(status: ReportStatus): string {
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }

  getCategoryDisplayName(category: WasteCategory): string {
    return category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
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
