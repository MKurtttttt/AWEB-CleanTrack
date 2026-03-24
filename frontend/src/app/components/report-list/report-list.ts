import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../services/report';
import { WasteReport, ReportStatus, WasteCategory } from '../../models/waste-report.model';

@Component({
  selector: 'app-report-list',
  imports: [CommonModule],
  templateUrl: './report-list.html',
  styleUrl: './report-list.scss',
})
export class ReportList implements OnInit {
  reports: WasteReport[] = [];
  isLoading = true;

  constructor(private reportService: ReportService) {}

  ngOnInit() {
    this.loadReports();
  }

  loadReports() {
    this.reportService.getReports().subscribe(data => {
      this.reports = data;
      this.isLoading = false;
    });
  }

  getStatusDisplayName(status: ReportStatus): string {
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }

  getCategoryDisplayName(category: WasteCategory): string {
    return category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }
}
