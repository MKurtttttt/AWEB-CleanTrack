import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navigation',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss',
})
export class Navigation {
  constructor(private router: Router) {}

  private isAdminSection(): boolean {
    return this.router.url.startsWith('/admin');
  }

  getReportRoute(): string {
    return this.isAdminSection() ? '/admin/reports' : '/resident/report';
  }

  getDashboardRoute(): string {
    return this.isAdminSection() ? '/admin/dashboard' : '/resident';
  }

  getMapRoute(): string {
    return '/admin/map';
  }

  getReportsRoute(): string {
    return this.isAdminSection() ? '/admin/reports' : '/resident/reports';
  }

  getNotificationsRoute(): string {
    return this.isAdminSection() ? '/admin/notifications' : '/resident/notifications';
  }

  isCurrentRoute(route: string): boolean {
    return this.router.url === route;
  }
}
