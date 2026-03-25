import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    console.log('AuthGuard: Checking authentication...');
    console.log('AuthGuard: isLoggedIn:', this.authService.isLoggedIn());
    console.log('AuthGuard: Current user:', this.authService.getCurrentUser());
    
    if (this.authService.isLoggedIn()) {
      console.log('AuthGuard: User is authenticated, allowing access');
      return true;
    }
    
    console.log('AuthGuard: User not authenticated, redirecting to login');
    this.router.navigate(['/login']);
    return false;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    console.log('=== AdminGuard CHECK ===');
    console.log('AdminGuard: Checking admin access...');
    console.log('AdminGuard: isLoggedIn:', this.authService.isLoggedIn());
    console.log('AdminGuard: Current user:', this.authService.getCurrentUser());
    console.log('AdminGuard: isAdmin:', this.authService.isAdmin());
    console.log('AdminGuard: isOfficial:', this.authService.isOfficial());
    
    if (this.authService.isLoggedIn() && (this.authService.isAdmin() || this.authService.isOfficial())) {
      console.log('AdminGuard: User has admin/official role, allowing access');
      return true;
    }
    
    console.log('AdminGuard: User does not have admin/official role, redirecting to login');
    this.router.navigate(['/login']);
    return false;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ResidentGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    console.log('ResidentGuard: Checking resident access...');
    console.log('ResidentGuard: isLoggedIn:', this.authService.isLoggedIn());
    console.log('ResidentGuard: isResident:', this.authService.isResident());
    console.log('ResidentGuard: Current user:', this.authService.getCurrentUser());
    
    if (this.authService.isLoggedIn() && this.authService.isResident()) {
      console.log('ResidentGuard: User has resident role, allowing access');
      return true;
    }
    
    console.log('ResidentGuard: User does not have resident role, redirecting to login');
    this.router.navigate(['/login']);
    return false;
  }
}
