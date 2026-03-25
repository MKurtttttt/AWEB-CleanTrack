import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { WasteReport, WasteCategory, ReportStatus, Priority } from '../models/waste-report.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private readonly apiUrl = `${environment.apiUrl}/waste-reports`;

  constructor(private http: HttpClient) {}

  createReport(formData: FormData): Observable<WasteReport> {
    return this.http
      .post<any>(this.apiUrl, formData, { headers: this.authHeaders })
      .pipe(map((report) => this.normalizeReport(report)));
  }

  getReports(): Observable<WasteReport[]> {
    return this.http
      .get<any>(this.apiUrl, { headers: this.authHeaders })
      .pipe(map((response) => (response?.reports || []).map((report: any) => this.normalizeReport(report))));
  }

  getAdminDashboard(): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/admin/dashboard`, { headers: this.authHeaders });
  }

  getReportById(id: string): Observable<WasteReport | undefined> {
    return this.http
      .get<any>(`${this.apiUrl}/${id}`, { headers: this.authHeaders })
      .pipe(map((report) => this.normalizeReport(report)));
  }

  updateReportStatus(reportId: string, status: ReportStatus): Observable<any> {
    return this.http
      .patch<any>(`${this.apiUrl}/${reportId}/status`, { status }, { headers: this.authHeaders })
      .pipe(map((report) => this.normalizeReport(report)));
  }

  getReportsByStatus(status: ReportStatus): Observable<WasteReport[]> {
    return this.http
      .get<any>(`${this.apiUrl}?status=${status}`, { headers: this.authHeaders })
      .pipe(map((response) => (response?.reports || []).map((report: any) => this.normalizeReport(report))));
  }

  getReportsByCategory(category: WasteCategory): Observable<WasteReport[]> {
    return this.http
      .get<any>(`${this.apiUrl}?category=${category}`, { headers: this.authHeaders })
      .pipe(map((response) => (response?.reports || []).map((report: any) => this.normalizeReport(report))));
  }

  assignReport(id: string, assignedTo: string): Observable<WasteReport | null> {
    return this.http
      .patch<any>(`${this.apiUrl}/${id}/assign`, { assignedTo }, { headers: this.authHeaders })
      .pipe(map((report) => this.normalizeReport(report)));
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
      priority: (report.priority || 'MEDIUM') as Priority
    };
  }
}
