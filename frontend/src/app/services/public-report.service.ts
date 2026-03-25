import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PublicReportService {
  private readonly apiUrl = `${environment.apiUrl}/waste-reports`;

  constructor(private http: HttpClient) {}

  createPublicReport(formData: FormData): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/public`, formData)
      .pipe(map((response) => this.normalizeReport(response)));
  }

  private normalizeReport(report: any): any {
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
      reportedBy: report.reportedBy || 'Anonymous',
      reportedAt: new Date(report.createdAt || Date.now()),
      updatedAt: new Date(report.updatedAt || Date.now()),
      priority: (report.priority || 'MEDIUM')
    };
  }
}
