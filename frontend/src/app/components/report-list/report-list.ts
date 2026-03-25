import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../services/report';
import { WasteReport, ReportStatus, WasteCategory } from '../../models/waste-report.model';

@Component({
  selector: 'app-report-list',
  imports: [CommonModule],
  templateUrl: './report-list.html',
  styleUrl: './report-list.scss',
})
export class ReportList implements OnInit, OnDestroy {
  reports: WasteReport[] = [];
  isLoading = true;
  private loadCount = 0;

  constructor(
    private reportService: ReportService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('ReportList initialized, load count:', ++this.loadCount);
    const token = localStorage.getItem('auth_token');
    console.log('Token exists:', !!token);
    
    // Only load if this is the first initialization
    if (this.loadCount === 1) {
      this.loadReports();
    }
  }

  ngOnDestroy() {
    console.log('ReportList destroyed');
  }

  loadReports() {
    console.log('Loading reports...');
    this.isLoading = true;
    this.cdr.detectChanges(); // Force UI update
    
    this.reportService.getReports().subscribe({
      next: (data) => {
        console.log('Reports loaded:', data);
        this.reports = data;
        this.isLoading = false;
        console.log('Loading state set to false, isLoading:', this.isLoading);
        this.cdr.detectChanges(); // Force UI update
      },
      error: (error) => {
        console.error('Error loading reports:', error);
        this.isLoading = false;
        this.cdr.detectChanges(); // Force UI update
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
}
