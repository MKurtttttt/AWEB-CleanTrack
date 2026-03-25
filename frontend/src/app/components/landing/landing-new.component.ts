import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="landing-container">

      <!-- NAV -->
      <nav class="navbar">
        <a href="#" class="nav-logo">
          <div class="logo-icon">🌿</div>
          CleanTrack
        </a>
        <ul class="nav-links">
          <li><a href="#" (click)="scrollToSection('how'); $event.preventDefault()">How it works</a></li>
          <li><a href="#" (click)="scrollToSection('report'); $event.preventDefault()">Report</a></li>
          <li><a href="#" (click)="scrollToSection('features'); $event.preventDefault()">Features</a></li>
          <li><a href="/login" class="nav-cta">Login</a></li>
        </ul>
      </nav>

      <!-- HERO -->
      <section class="hero">
        <div class="hero-badge">🌍 Community-Powered Cleanliness</div>
        <h1>Your community<br>deserves to be <em>clean.</em></h1>
        <p class="hero-sub">Report trash, illegal dumping, and waste in your neighborhood. CleanTrack routes your reports directly to City Hall for swift action.</p>
        <div class="hero-actions">
          <button class="btn-primary" (click)="scrollToSection('report')">📍 Report an Issue</button>
          <a href="#" (click)="scrollToSection('how'); $event.preventDefault()" class="btn-secondary">See how it works →</a>
        </div>
      </section>

      <!-- REPORT INSTRUCTIONS -->
      <section class="section" id="report">
        <div class="section-label">Get Started</div>
        <h2 class="section-title">Ready to report an issue?</h2>
        
        <div class="report-instructions">
          <div class="instruction-card">
            <div class="instruction-icon">🚀</div>
            <div class="instruction-content">
              <h3>Register & Report</h3>
              <p>Create a free account to submit detailed waste reports with photos and track their progress.</p>
              <div class="instruction-actions">
                <button class="btn-primary" (click)="goToRegister()">📝 Register Now</button>
                <button class="btn-secondary" (click)="goToLogin()">🔐 Login to Report</button>
              </div>
            </div>
          </div>
          
          <div class="benefits-section">
            <h4>🌟 Benefits of Registered Reporting:</h4>
            <div class="benefits-grid">
              <div class="benefit">
                <span class="benefit-icon">📸</span>
                <span class="benefit-text">Upload photo evidence</span>
              </div>
              <div class="benefit">
                <span class="benefit-icon">📍</span>
                <span class="benefit-text">Pin exact location</span>
              </div>
              <div class="benefit">
                <span class="benefit-icon">🔔</span>
                <span class="benefit-text">Receive status updates</span>
              </div>
              <div class="benefit">
                <span class="benefit-icon">📊</span>
                <span class="benefit-text">Track resolution progress</span>
              </div>
              <div class="benefit">
                <span class="benefit-icon">🏆</span>
                <span class="benefit-text">Build community reputation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FOOTER -->
      <footer class="footer">
        <div class="footer-content">
          <div class="footer-logo">CleanTrack<span>+</span></div>
          <div class="footer-sub">© 2024 CleanTrack. Keeping Angeles City clean, one report at a time.</div>
        </div>
      </footer>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    
    .landing-container {
      min-height: 100vh;
    }
    
    /* NAV */
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(10px);
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 1000;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    
    .nav-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-weight: 700;
      font-size: 1.2rem;
      color: #2c3e50;
      text-decoration: none;
    }
    
    .logo-icon {
      width: 40px;
      height: 40px;
      background: #27ae60;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }
    
    .nav-links {
      display: flex;
      gap: 2rem;
      align-items: center;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    
    .nav-links a {
      color: #2c3e50;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }
    
    .nav-links a:hover {
      color: #27ae60;
    }
    
    .nav-cta {
      background: #27ae60;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 25px;
      text-decoration: none;
      font-weight: 600;
    }
    
    /* HERO */
    .hero {
      padding: 8rem 2rem 4rem;
      text-align: center;
      background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    }
    
    .hero-badge {
      background: #27ae60;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 25px;
      font-size: 0.8rem;
      font-weight: 600;
      display: inline-block;
      margin-bottom: 1rem;
    }
    
    .hero h1 {
      font-size: clamp(2.5rem, 5vw, 4rem);
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: 1.5rem;
      color: #2c3e50;
    }
    
    .hero-sub {
      font-size: 1.1rem;
      color: #6c757d;
      max-width: 600px;
      margin: 0 auto 2rem;
      line-height: 1.6;
    }
    
    .hero-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    /* SECTIONS */
    .section {
      padding: 4rem 2rem;
    }
    
    .section-label {
      color: #27ae60;
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 1rem;
    }
    
    .section-title {
      font-size: 2.2rem;
      font-weight: 700;
      color: #2c3e50;
      margin-bottom: 2rem;
      text-align: center;
    }
    
    /* REPORT INSTRUCTIONS */
    .report-instructions {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .instruction-card {
      background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
      border-radius: 16px;
      padding: 2.5rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      border: 1px solid rgba(0,0,0,0.05);
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .instruction-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      display: block;
    }
    
    .instruction-content h3 {
      font-size: 1.3rem;
      font-weight: 700;
      color: #2c3e50;
      margin-bottom: 1rem;
    }
    
    .instruction-content p {
      color: #6c757d;
      margin-bottom: 1.5rem;
      line-height: 1.5;
    }
    
    .instruction-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .benefits-section {
      background: rgba(39, 174, 96, 0.05);
      border-radius: 12px;
      padding: 1.5rem;
      margin-top: 2rem;
    }
    
    .benefits-section h4 {
      margin: 0 0 1rem 0;
      color: #27ae60;
      font-size: 1.1rem;
      font-weight: 600;
    }
    
    .benefits-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }
    
    .benefit {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .benefit-icon {
      font-size: 1.5rem;
    }
    
    .benefit-text {
      font-weight: 500;
      color: #2c3e50;
    }
    
    /* BUTTONS */
    .btn-primary, .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.875rem 1.5rem;
      border-radius: 50px;
      font-weight: 600;
      font-size: 0.95rem;
      text-decoration: none;
      border: none;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      font-family: 'DM Sans', sans-serif;
    }
    
    .btn-primary {
      background: #27ae60;
      color: white;
    }
    
    .btn-secondary {
      background: transparent;
      color: #2c3e50;
      border: 2px solid #27ae60;
    }
    
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(39, 174, 96, 0.4);
    }
    
    .btn-secondary:hover {
      background: #27ae60;
      color: white;
      transform: translateY(-2px);
    }
    
    /* FOOTER */
    .footer {
      border-top: 1px solid rgba(255,255,255,0.1);
      padding: 3rem 2rem;
      background: #2c3e50;
      color: white;
      text-align: center;
    }
    
    .footer-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
    }
    
    .footer-logo {
      font-family: 'Syne', sans-serif;
      font-weight: 800;
      color: white;
      font-size: 1rem;
    }
    
    .footer-logo span {
      color: #27ae60;
    }
    
    .footer-sub {
      font-size: 0.8rem;
      font-weight: 400;
      color: #bdc3c7;
    }
    
    /* RESPONSIVE */
    @media (max-width: 768px) {
      .hero { padding: 4rem 1rem; }
      .instruction-actions { flex-direction: column; }
      .benefits-grid { grid-template-columns: 1fr; }
    }
  `
})
export class LandingComponent {
  constructor(private router: Router) {
    console.log('🌿 Landing Page Component Initialized!');
  }

  goToReport() {
    this.scrollToSection('report');
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
