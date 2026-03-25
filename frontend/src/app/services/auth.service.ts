import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

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
  private readonly apiUrl = `${this.getApiUrl()}/users`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenKey = 'auth_token';

  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    console.log('AuthService: Initializing...');
    console.log('AuthService: Loading user from storage...');
    
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem(this.tokenKey);
      console.log('AuthService: Token found:', !!token);
      
      if (token) {
        try {
          // Simple token decode for now - in production, you'd want proper JWT validation
          const payload = JSON.parse(atob(token.split('.')[1]));
          const user: User = {
            id: payload.id,
            name: payload.name,
            email: payload.email,
            phone: payload.phone,
            role: payload.role,
            barangay: payload.barangay
          };
          this.currentUserSubject.next(user);
          console.log('AuthService: User loaded from token:', user?.email);
        } catch (error) {
          console.log('AuthService: Invalid token, removing it');
          localStorage.removeItem(this.tokenKey);
        }
      } else {
        console.log('AuthService: No token found in storage');
      }
    }
    
    console.log('AuthService: Initialization complete, current user:', this.currentUserSubject.value);
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

  private getApiUrl(): string {
    // Check if we're in production and use fallback if needed
    if (typeof window !== 'undefined' && 
        window.location.hostname !== 'localhost' && 
        window.location.hostname !== '127.0.0.1') {
      // Production environment - use Render backend
      return 'https://aweb-cleantrack.onrender.com/api';
    }
    // Development environment - use environment file
    return environment.apiUrl;
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
