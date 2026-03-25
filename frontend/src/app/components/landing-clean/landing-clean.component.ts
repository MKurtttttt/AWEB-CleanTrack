import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="landing-page">
      <!-- Navigation -->
      <nav class="navbar">
        <div class="nav-brand">
          <span class="logo">🌿</span>
          <span class="brand-name">CleanTrack</span>
        </div>
        <div class="nav-links">
          <a href="#" (click)="scrollToSection('features'); $event.preventDefault()">Features</a>
          <a href="#" (click)="scrollToSection('how'); $event.preventDefault()">How It Works</a>
          <a href="/login" class="nav-btn">Login</a>
          <a href="/register" class="nav-btn primary">Register</a>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <h1 class="hero-title">Keep Your Community Clean</h1>
          <p class="hero-subtitle">Report waste, track cleanup, and make a difference in your neighborhood</p>
          <div class="hero-actions">
            <button class="btn primary" (click)="goToRegister()">Get Started</button>
            <button class="btn secondary" (click)="goToLogin()">Login</button>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features" id="features">
        <div class="container">
          <h2 class="section-title">Why Choose CleanTrack?</h2>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">📸</div>
              <h3>Photo Reports</h3>
              <p>Upload photos of waste issues with precise location data</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📍</div>
              <h3>GPS Tracking</h3>
              <p>Pinpoint exact locations for faster cleanup response</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🔔</div>
              <h3>Real-time Updates</h3>
              <p>Get notified when your reports are processed and resolved</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📊</div>
              <h3>Track Progress</h3>
              <p>Monitor the status of your reports from submission to resolution</p>
            </div>
          </div>
        </div>
      </section>

      <!-- How It Works -->
      <section class="how-it-works" id="how">
        <div class="container">
          <h2 class="section-title">How It Works</h2>
          <div class="steps">
            <div class="step">
              <div class="step-number">1</div>
              <h3>Register Account</h3>
              <p>Create your free account to start reporting</p>
            </div>
            <div class="step">
              <div class="step-number">2</div>
              <h3>Report Issue</h3>
              <p>Submit waste reports with photos and location</p>
            </div>
            <div class="step">
              <div class="step-number">3</div>
              <h3>Track Progress</h3>
              <p>Monitor cleanup progress and get updates</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <div class="container">
          <p>&copy; 2024 CleanTrack. Keeping communities clean, one report at a time.</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .landing-page {
      min-height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
    }

    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 1000;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.5rem;
      font-weight: bold;
      color: #2c3e50;
    }

    .logo {
      font-size: 2rem;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .nav-links a {
      text-decoration: none;
      color: #666;
      font-weight: 500;
      transition: color 0.3s;
    }

    .nav-links a:hover {
      color: #27ae60;
    }

    .nav-btn {
      padding: 0.5rem 1rem;
      border-radius: 5px;
      text-decoration: none;
      border: 1px solid #ddd;
      transition: all 0.3s;
    }

    .nav-btn.primary {
      background: #27ae60;
      color: white;
      border-color: #27ae60;
    }

    .nav-btn.primary:hover {
      background: #219a52;
    }

    .hero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 8rem 2rem 4rem;
      text-align: center;
      margin-top: 60px;
    }

    .hero-title {
      font-size: 3rem;
      margin-bottom: 1rem;
      font-weight: 700;
    }

    .hero-subtitle {
      font-size: 1.2rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn {
      padding: 1rem 2rem;
      border: none;
      border-radius: 5px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s;
      text-decoration: none;
      display: inline-block;
    }

    .btn.primary {
      background: #27ae60;
      color: white;
    }

    .btn.primary:hover {
      background: #219a52;
      transform: translateY(-2px);
    }

    .btn.secondary {
      background: transparent;
      color: white;
      border: 2px solid white;
    }

    .btn.secondary:hover {
      background: white;
      color: #667eea;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .features {
      padding: 4rem 0;
      background: #f8f9fa;
    }

    .section-title {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 3rem;
      color: #2c3e50;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .feature-card {
      background: white;
      padding: 2rem;
      border-radius: 10px;
      text-align: center;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      transition: transform 0.3s;
    }

    .feature-card:hover {
      transform: translateY(-5px);
    }

    .feature-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .feature-card h3 {
      margin-bottom: 1rem;
      color: #2c3e50;
    }

    .how-it-works {
      padding: 4rem 0;
    }

    .steps {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .step {
      text-align: center;
      padding: 2rem;
    }

    .step-number {
      width: 60px;
      height: 60px;
      background: #27ae60;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: bold;
      margin: 0 auto 1rem;
    }

    .step h3 {
      margin-bottom: 1rem;
      color: #2c3e50;
    }

    .footer {
      background: #2c3e50;
      color: white;
      text-align: center;
      padding: 2rem 0;
    }

    @media (max-width: 768px) {
      .navbar {
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
      }

      .nav-links {
        flex-wrap: wrap;
        justify-content: center;
      }

      .hero {
        padding: 6rem 1rem 3rem;
      }

      .hero-title {
        font-size: 2rem;
      }

      .hero-actions {
        flex-direction: column;
        align-items: center;
      }

      .features-grid,
      .steps {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class LandingCleanComponent {
  constructor(private router: Router) {}

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
