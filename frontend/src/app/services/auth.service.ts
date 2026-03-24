import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    barangay: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  barangay: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/users';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenKey = 'auth_token';

  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    console.log('AuthService: Initializing...');
    this.loadUserFromStorage();
    console.log('AuthService: Initialization complete, current user:', this.getCurrentUser());
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    console.log('AuthService: Making login request to:', `${this.apiUrl}/login`);
    console.log('AuthService: Credentials:', credentials);
    
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        console.log('AuthService: Login response:', response);
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem(this.tokenKey, response.token);
          this.storeUserInfo(response.user);
          console.log('AuthService: Token and user info stored');
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem('current_user');
    }
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    console.log('isAdmin check - user:', user);
    console.log('isAdmin check - role:', user?.role);
    return user?.role === 'ADMIN';
  }

  isOfficial(): boolean {
    const user = this.getCurrentUser();
    console.log('isOfficial check - user:', user);
    console.log('isOfficial check - role:', user?.role);
    return user?.role === 'BARANGAY_OFFICIAL' || user?.role === 'WASTE_MANAGEMENT';
  }

  isResident(): boolean {
    const user = this.getCurrentUser();
    console.log('isResident check - user:', user);
    console.log('isResident check - role:', user?.role);
    return user?.role === 'RESIDENT';
  }

  private loadUserFromStorage(): void {
    console.log('AuthService: Loading user from storage...');
    if (isPlatformBrowser(this.platformId)) {
      const token = this.getToken();
      console.log('AuthService: Token found:', !!token);
      
      if (token) {
        // For now, we'll store user info in localStorage along with token
        const userInfo = localStorage.getItem('current_user');
        console.log('AuthService: User info from storage:', userInfo);
        
        if (userInfo) {
          try {
            const user = JSON.parse(userInfo);
            console.log('AuthService: Parsed user:', user);
            console.log('AuthService: User role:', user.role);
            this.currentUserSubject.next(user);
            console.log('AuthService: User subject updated');
          } catch (error) {
            console.error('AuthService: Error parsing user info:', error);
            this.logout();
          }
        } else {
          console.log('AuthService: No user info found in storage, but token exists');
          // Token exists but no user info - this might be a session issue
          this.logout();
        }
      } else {
        console.log('AuthService: No token found in storage');
      }
    } else {
      console.log('AuthService: Not in browser platform, skipping storage load');
    }
  }

  // Helper method to store user info
  storeUserInfo(user: User): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log('Storing user info:', user);
      localStorage.setItem('current_user', JSON.stringify(user));
      this.currentUserSubject.next(user);
      console.log('User info stored and subject updated');
    }
  }
}
