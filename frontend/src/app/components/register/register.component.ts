import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="register-container">
      <div class="register-card">
        <div class="register-header">
          <h2>Register</h2>
          <p>Create your CleanTrack account</p>
        </div>
        
        <form (ngSubmit)="onSubmit()" class="register-form">
          <div class="form-row">
            <div class="form-group">
              <label for="name">Full Name</label>
              <input
                type="text"
                id="name"
                [(ngModel)]="userData.name"
                name="name"
                required
                placeholder="Enter your full name"
                class="form-control"
              />
            </div>
            
            <div class="form-group">
              <label for="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                [(ngModel)]="userData.phone"
                name="phone"
                required
                placeholder="Enter your phone number"
                class="form-control"
              />
            </div>
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              [(ngModel)]="userData.email"
              name="email"
              required
              placeholder="Enter your email"
              class="form-control"
            />
          </div>
          
          <div class="form-group">
            <label for="barangay">Barangay</label>
            <input
              type="text"
              id="barangay"
              [(ngModel)]="userData.barangay"
              name="barangay"
              required
              placeholder="Enter your barangay"
              class="form-control"
            />
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              [(ngModel)]="userData.password"
              name="password"
              required
              placeholder="Create a password (min 6 characters)"
              class="form-control"
            />
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              [(ngModel)]="confirmPassword"
              name="confirmPassword"
              required
              placeholder="Confirm your password"
              class="form-control"
            />
          </div>
          
          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>
          
          <button type="submit" class="register-btn" [disabled]="isLoading">
            {{ isLoading ? 'Creating Account...' : 'Register' }}
          </button>
        </form>
        
        <div class="register-footer">
          <p>Already have an account? <a href="/login">Login here</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

    :host {
      --green: #1a7a4a;
      --green-mid: #25a366;
      --green-neon: #39e07a;
      --dark: #0d1f14;
      --dark-2: #162a1e;
      --text: #e8f0eb;
      --text-muted: #8aab97;
      --white: #f9fdf9;
      --danger: #e85c3a;
      --warning: #f0a500;
      --radius: 16px;
    }

    .register-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--dark);
      padding: 20px;
      font-family: 'DM Sans', sans-serif;
      position: relative;
    }
    
    .register-card {
      background: var(--dark-2);
      border: 1px solid rgba(57, 224, 122, 0.15);
      border-radius: 24px;
      box-shadow: 0 40px 80px rgba(0, 0, 0, 0.5);
      padding: 48px;
      width: 100%;
      max-width: 500px;
      position: relative;
      overflow: hidden;
    }

    .register-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(57,224,122,0.5), transparent);
    }
    
    .register-header {
      text-align: center;
      margin-bottom: 32px;
    }
    
    .register-header h2 {
      font-family: 'Syne', sans-serif;
      color: var(--white);
      margin-bottom: 8px;
      font-size: 2rem;
      font-weight: 800;
      letter-spacing: -0.02em;
    }
    
    .register-header p {
      color: var(--text-muted);
      margin: 0;
      font-size: 14px;
      font-weight: 300;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 8px;
      color: var(--text-muted);
      font-weight: 500;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .form-control {
      width: 100%;
      padding: 14px 18px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      font-size: 0.9rem;
      transition: border-color 0.2s, box-shadow 0.2s;
      box-sizing: border-box;
      color: var(--text);
      font-family: 'DM Sans', sans-serif;
      outline: none;
    }
    
    .form-control:focus {
      border-color: rgba(57, 224, 122, 0.4);
      box-shadow: 0 0 0 3px rgba(57, 224, 122, 0.08);
      background: rgba(255,255,255,0.06);
    }

    .form-control::placeholder {
      color: var(--text-muted);
    }
    
    .error-message {
      background: rgba(232, 92, 58, 0.1);
      border: 1px solid rgba(232, 92, 58, 0.2);
      color: var(--danger);
      padding: 14px;
      border-radius: 10px;
      margin-bottom: 20px;
      font-size: 0.85rem;
      font-weight: 500;
    }
    
    .register-btn {
      width: 100%;
      padding: 16px;
      background: var(--green-neon);
      color: var(--dark);
      border: none;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      font-family: 'DM Sans', sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    
    .register-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 16px 40px rgba(57, 224, 122, 0.4);
    }
    
    .register-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    .register-footer {
      text-align: center;
      margin-top: 28px;
      padding-top: 20px;
      border-top: 1px solid rgba(255,255,255,0.06);
    }
    
    .register-footer p {
      color: var(--text-muted);
      font-size: 0.85rem;
      margin: 0;
    }
    
    .register-footer a {
      color: var(--green-neon);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }
    
    .register-footer a:hover {
      color: var(--green-light);
    }

    /* Loading state */
    .register-btn.loading {
      position: relative;
      color: transparent;
    }

    .register-btn.loading::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      top: 50%;
      left: 50%;
      margin-left: -8px;
      margin-top: -8px;
      border: 2px solid var(--dark);
      border-radius: 50%;
      border-top-color: transparent;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    @media (max-width: 600px) {
      .form-row {
        grid-template-columns: 1fr;
        gap: 0;
      }
      
      .register-card {
        padding: 30px 20px;
      }
    }
  `]
})
export class RegisterComponent {
  userData = {
    name: '',
    email: '',
    password: '',
    phone: '',
    barangay: '',
    role: 'RESIDENT' // Default role for registration
  };
  
  confirmPassword = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Validate passwords match
    if (this.userData.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      this.isLoading = false;
      return;
    }

    this.authService.register(this.userData).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/login']);
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}
