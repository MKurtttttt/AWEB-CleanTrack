import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { LandingComponent } from './components/landing/landing.component';
import { NotificationDemoComponent } from './components/notification-demo/notification-demo.component';
import { AuthGuard, AdminGuard, ResidentGuard } from './guards/auth.guard';
import { ReportForm } from './components/report-form/report-form';
import { ReportList } from './components/report-list/report-list';

export const routes: Routes = [
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  { path: 'landing', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'notifications-demo', component: NotificationDemoComponent },
  
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
    loadComponent: () => import('./components/admin-notifications/admin-notifications.component').then(m => m.AdminNotificationsComponent),
    canActivate: [AdminGuard]
  },
  
  // Resident routes (protected)
  { 
    path: 'resident', 
    children: [
      { 
        path: 'dashboard', 
        loadComponent: () => import('./components/report-form/report-form').then(m => m.ReportForm),
        canActivate: [ResidentGuard]
      }, 
      { 
        path: 'report', 
        loadComponent: () => import('./components/report-form/report-form').then(m => m.ReportForm),
        canActivate: [ResidentGuard]
      }, 
      { 
        path: 'my-reports', 
        loadComponent: () => import('./components/report-list/report-list').then(m => m.ReportList),
        canActivate: [ResidentGuard]
      },
      { 
        path: 'map', 
        loadComponent: () => import('./components/map-view/map-view').then(m => m.MapView),
        canActivate: [ResidentGuard]
      },
      { 
        path: 'notifications', 
        loadComponent: () => import('./components/notifications/notifications').then(m => m.Notifications),
        canActivate: [ResidentGuard]
      }
    ]
  },
  
  // Catch-all route (must be last)
  { path: '**', redirectTo: '/landing' }
];
