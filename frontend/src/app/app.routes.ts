import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { LandingComponent } from './components/landing/landing.component';
import { AuthGuard, AdminGuard, ResidentGuard } from './guards/auth.guard';
import { ReportForm } from './components/report-form/report-form';
import { ReportList } from './components/report-list/report-list';

export const routes: Routes = [
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  { path: 'landing', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  // Admin routes (protected)
  { 
    path: 'admin', 
    loadComponent: () => import('./components/dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [AdminGuard]
  },
  { 
    path: 'admin/dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [AdminGuard]
  },
  { 
    path: 'admin/reports', 
    loadComponent: () => import('./components/report-list/report-list').then(m => m.ReportList),
    canActivate: [AdminGuard]
  },
  { 
    path: 'admin/map', 
    loadComponent: () => import('./components/map-view/map-view').then(m => m.MapView),
    canActivate: [AdminGuard]
  },
  { 
    path: 'admin/notifications', 
    loadComponent: () => import('./components/notifications/notifications').then(m => m.Notifications),
    canActivate: [AdminGuard]
  },
  
  // Resident routes (protected)
  { 
    path: 'resident', 
    loadComponent: () => import('./components/report-form/report-form').then(m => m.ReportForm),
    canActivate: [ResidentGuard]
  },
  { 
    path: 'resident/report', 
    loadComponent: () => import('./components/report-form/report-form').then(m => m.ReportForm),
    canActivate: [ResidentGuard]
  },
  { 
    path: 'resident/reports', 
    redirectTo: '/resident/report',
    pathMatch: 'full'
  },
  { 
    path: 'resident/map', 
    loadComponent: () => import('./components/map-view/map-view').then(m => m.MapView),
    canActivate: [ResidentGuard]
  },
  { 
    path: 'resident/notifications', 
    loadComponent: () => import('./components/notifications/notifications').then(m => m.Notifications),
    canActivate: [ResidentGuard]
  },
  
  // Legacy routes (redirect to new structure)
  { path: 'report', redirectTo: '/resident/report', pathMatch: 'full' },
  { path: 'dashboard', redirectTo: '/admin/dashboard', pathMatch: 'full' },
  { path: 'map', redirectTo: '/admin/map', pathMatch: 'full' },
  { path: 'reports', redirectTo: '/resident/reports', pathMatch: 'full' },
  { path: 'notifications', redirectTo: '/resident/notifications', pathMatch: 'full' },
  
  { path: '**', redirectTo: '/landing' }
];
