import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <!-- Background decoration -->
      <div class="bg-orb orb-1"></div>
      <div class="bg-orb orb-2"></div>
      <div class="bg-grid"></div>
      
      <div class="login-card">
        <div class="login-header">
          <div class="logo-section">
            <div class="logo-icon">CT</div>
            <h2>CleanTrack</h2>
          </div>
          <p class="login-subtitle">Waste Management System</p>
        </div>
        
        <form (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label for="email" class="form-label">Email Address</label>
            <div class="input-wrapper">
              <span class="input-icon">@</span>
              <input
                type="email"
                id="email"
                [(ngModel)]="credentials.email"
                name="email"
                required
                placeholder="Enter your email address"
                class="form-input"
              />
            </div>
          </div>
          
          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <div class="input-wrapper">
              <span class="input-icon">*</span>
              <input
                type="password"
                id="password"
                [(ngModel)]="credentials.password"
                name="password"
                required
                placeholder="Enter your password"
                class="form-input"
              />
            </div>
          </div>
          
          <div class="error-message" *ngIf="errorMessage">
            <span class="error-icon">!</span>
            {{ errorMessage }}
          </div>
          
          <button type="submit" class="login-btn" [disabled]="isLoading">
            <span *ngIf="!isLoading" class="btn-content">
              <span class="btn-icon">→</span>
              Login to Dashboard
            </span>
            <span *ngIf="isLoading" class="btn-loading">
              <span class="spinner"></span>
              Logging in...
            </span>
          </button>

          <button type="button" class="cancel-btn" *ngIf="isLoading" (click)="cancelLogin()">
            Cancel
          </button>
        </form>
        
        <div class="login-footer">
          <p>Don't have an account? <a href="/register" class="register-link">Register here</a></p>
        </div>
        
        <div class="demo-section">
          <h4 class="demo-title">Demo Accounts</h4>
          <div class="demo-accounts">
            <div class="demo-account admin">
              <div class="demo-role">Admin</div>
              <div class="demo-details">
                <div class="demo-email">admin@cleantrack.com</div>
                <div class="demo-password">admin123</div>
              </div>
            </div>
            <div class="demo-account official">
              <div class="demo-role">Official</div>
              <div class="demo-details">
                <div class="demo-email">juan@barangay.gov</div>
                <div class="demo-password">official123</div>
              </div>
            </div>
            <div class="demo-account resident">
              <div class="demo-role">Resident</div>
              <div class="demo-details">
                <div class="demo-email">pedro@email.com</div>
                <div class="demo-password">resident123</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

    :host {
      --green: #1a7a4a;
      --green-mid: #25a366;
      --green-neon: #39e07a;
      --green-dim: #16a34a;
      --dark: #0d1f14;
      --dark-2: #162a1e;
      --dark-3: #0f2318;
      --text: #e8f0eb;
      --text-muted: #8aab97;
      --white: #f9fdf9;
      --danger: #e85c3a;
      --warning: #f0a500;
      --radius: 16px;
    }

    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--dark);
      position: relative;
      overflow: hidden;
      padding: 2rem;
    }

    /* Background effects */
    .bg-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(57, 224, 122, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(57, 224, 122, 0.03) 1px, transparent 1px);
      background-size: 60px 60px;
      pointer-events: none;
    }

    .bg-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(100px);
      pointer-events: none;
    }

    .orb-1 {
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(57, 224, 122, 0.08) 0%, transparent 70%);
      top: -200px;
      right: -200px;
      animation: float 20s ease-in-out infinite;
    }

    .orb-2 {
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(57, 224, 122, 0.05) 0%, transparent 70%);
      bottom: -150px;
      left: -150px;
      animation: float 25s ease-in-out infinite reverse;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-30px) rotate(180deg); }
    }

    .login-card {
      width: 100%;
      max-width: 480px;
      background: var(--dark-2);
      border: 1px solid rgba(57, 224, 122, 0.15);
      border-radius: 32px;
      padding: 3rem;
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5), 0 0 120px rgba(57, 224, 122, 0.1);
      backdrop-filter: blur(20px);
      position: relative;
      overflow: hidden;
    }

    .login-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
      background: linear-gradient(90deg, var(--green-neon) 0%, var(--green-mid) 100%);
    }

    .login-header {
      text-align: center;
      margin-bottom: 2.5rem;
    }

    .logo-section {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 1rem;
    }

    .logo-icon {
      font-size: 2.5rem;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--green-neon) 0%, var(--green-mid) 100%);
      border-radius: 16px;
      color: var(--dark);
      font-weight: bold;
    }

    .login-header h2 {
      font-family: 'Syne', sans-serif;
      font-weight: 900;
      font-size: 2rem;
      color: var(--text);
      margin: 0;
      letter-spacing: -0.02em;
    }

    .login-subtitle {
      color: var(--text-muted);
      font-size: 1rem;
      font-weight: 400;
      margin: 0;
    }

    .login-form {
      margin-bottom: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-label {
      display: block;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .input-wrapper {
      position: relative;
    }

    .input-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.2rem;
      z-index: 2;
    }

    .form-input {
      width: 100%;
      padding: 1rem 1rem 1rem 3.5rem;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      color: var(--text);
      font-family: 'DM Sans', sans-serif;
      font-size: 1rem;
      outline: none;
      transition: all 0.3s ease;
    }

    .form-input:focus {
      border-color: rgba(57, 224, 122, 0.4);
      box-shadow: 0 0 0 3px rgba(57, 224, 122, 0.1);
      background: rgba(255, 255, 255, 0.06);
      transform: translateY(-1px);
    }

    .form-input::placeholder {
      color: var(--text-muted);
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(232, 92, 58, 0.1);
      border: 1px solid rgba(232, 92, 58, 0.3);
      color: var(--danger);
      padding: 0.75rem 1rem;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 500;
      margin-bottom: 1rem;
    }

    .error-icon {
      font-size: 1rem;
    }

    .login-btn {
      width: 100%;
      padding: 1rem;
      background: linear-gradient(135deg, var(--green-neon) 0%, var(--green-mid) 100%);
      color: var(--dark);
      border: none;
      border-radius: 16px;
      font-family: 'Syne', sans-serif;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      margin-bottom: 1rem;
    }

    .login-btn::before {
      content: '';
      position: absolute;
      top: 0; left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left 0.5s;
    }

    .login-btn:hover::before {
      left: 100%;
    }

    .login-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 12px 40px rgba(57, 224, 122, 0.4);
    }

    .login-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }

    .btn-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .btn-icon {
      font-size: 1.2rem;
    }

    .btn-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid var(--dark);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .cancel-btn {
      width: 100%;
      padding: 0.75rem;
      background: transparent;
      color: var(--text-muted);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      font-family: 'DM Sans', sans-serif;
      font-weight: 500;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .cancel-btn:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.2);
      color: var(--text);
    }

    .login-footer {
      text-align: center;
      margin-bottom: 2rem;
    }

    .login-footer p {
      color: var(--text-muted);
      font-size: 0.9rem;
      margin: 0;
    }

    .register-link {
      color: var(--green-neon);
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .register-link:hover {
      color: var(--green-mid);
      text-decoration: underline;
    }

    .demo-section {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 20px;
      padding: 1.5rem;
    }

    .demo-title {
      font-family: 'Syne', sans-serif;
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--text-muted);
      margin: 0 0 1rem 0;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .demo-accounts {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .demo-account {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      transition: all 0.3s ease;
    }

    .demo-account:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(57, 224, 122, 0.3);
      transform: translateX(4px);
    }

    .demo-role {
      font-weight: 600;
      color: var(--text);
      font-size: 0.85rem;
      min-width: 80px;
    }

    .demo-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .demo-email {
      font-size: 0.8rem;
      color: var(--text-muted);
      font-family: 'DM Sans', sans-serif;
    }

    .demo-password {
      font-size: 0.8rem;
      color: var(--text-muted);
      font-family: 'DM Sans', sans-serif;
      opacity: 0.7;
    }

    /* Responsive */
    @media (max-width: 640px) {
      .login-card {
        padding: 2rem;
        margin: 1rem;
      }
      
      .login-header h2 {
        font-size: 1.5rem;
      }
      
      .logo-icon {
        width: 50px;
        height: 50px;
        font-size: 2rem;
      }
      
      .demo-account {
        flex-direction: column;
        text-align: center;
        gap: 0.5rem;
      }
    }
  `]
})
export class LoginComponent {
  credentials: LoginRequest = {
    email: '',
    password: ''
  };
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.isLoading = false;
        
        // Redirect based on user role
        const currentUser = this.authService.getCurrentUser();
        if (this.authService.isAdmin() || this.authService.isOfficial()) {
          this.router.navigate(['/admin/dashboard']);
        } else if (this.authService.isResident()) {
          this.router.navigate(['/resident/dashboard']);
        } else {
          this.router.navigate(['/landing']);
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Login error:', error);
        this.isLoading = false;
        
        if (error.status === 401) {
          this.errorMessage = 'Invalid email or password';
        } else if (error.status === 403) {
          this.errorMessage = 'Account is not active';
        } else if (error.status === 429) {
          this.errorMessage = 'Too many login attempts. Please try again later.';
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
      }
    });
  }

  cancelLogin() {
    this.isLoading = false;
  }
}
