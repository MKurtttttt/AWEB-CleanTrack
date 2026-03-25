import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="navbar">
      <a href="#" class="nav-logo" (click)="goHome($event)">
        <div class="logo-icon">🌿</div>
        CleanTrack
      </a>
      
      <ul class="nav-links" *ngIf="!isLoggedIn">
        <li><a href="#how">How it works</a></li>
        <li><a href="#report">Report</a></li>
        <li><a href="#features">Features</a></li>
        <li><a href="/login" class="nav-cta">Login</a></li>
      </ul>

      <ul class="nav-links" *ngIf="isLoggedIn">
        <li *ngIf="isAdminView"><a [routerLink]="dashboardRoute">Dashboard</a></li>
        <li *ngIf="!isAdminView"><a [routerLink]="reportRoute">Report</a></li>
        <li *ngIf="isAdminView"><a [routerLink]="reportsRoute">Reports</a></li>
        <li><a [routerLink]="mapRoute">Map</a></li>
        <li><a [routerLink]="notificationsRoute">Notifications</a></li>
        <li><a href="#" (click)="logout($event)" class="nav-cta">Logout</a></li>
      </ul>
    </nav>
  `,
  styles: [`
    .nav-links {
      display: flex;
      align-items: center;
      gap: 36px;
      list-style: none;
      margin: 0; padding: 0;
    }

    .nav-links a {
      color: var(--text-muted);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      letter-spacing: 0.02em;
      transition: color 0.2s;
    }

    .nav-links a:hover { color: var(--green-neon); }

    .nav-cta {
      background: var(--green-neon) !important;
      color: var(--dark) !important;
      padding: 10px 22px;
      border-radius: 50px;
      font-weight: 600 !important;
      transition: transform 0.2s, box-shadow 0.2s !important;
    }

    .nav-cta:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 24px rgba(57, 224, 122, 0.35) !important;
      color: var(--dark) !important;
    }

    @media (max-width: 768px) {
      .nav-links {
        gap: 20px;
      }
      
      .nav-links li:not(:last-child) {
        display: none;
      }
    }
  `]
})
export class NavbarComponent {
  isLoggedIn = false;
  currentRole = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.currentRole = user?.role || '';
    });
  }

  get isAdminView(): boolean {
    return this.currentRole === 'ADMIN' || this.currentRole === 'BARANGAY_OFFICIAL' || this.currentRole === 'WASTE_MANAGEMENT';
  }

  get dashboardRoute(): string {
    return this.isAdminView ? '/admin/dashboard' : '/resident/dashboard';
  }

  get reportsRoute(): string {
    return this.isAdminView ? '/admin/reports' : '/resident/my-reports';
  }

  get mapRoute(): string {
    return this.isAdminView ? '/admin/map' : '/resident/map';
  }

  get reportRoute(): string {
    return '/resident/report';
  }

  get notificationsRoute(): string {
    return this.isAdminView ? '/admin/notifications' : '/resident/notifications';
  }

  goHome(event: Event) {
    event.preventDefault();
    this.router.navigate([this.isLoggedIn ? this.dashboardRoute : '/']);
  }

  logout(event: Event) {
    event.preventDefault();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
