import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
 
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="landing">
 
      <!-- NAV -->
      <nav class="nav">
        <a class="nav-logo" href="#" (click)="$event.preventDefault()">
          <span class="logo-leaf">✦</span>
          CleanTrack
        </a>
        <ul class="nav-links">
          <li><a href="#how" (click)="scrollToSection('how'); $event.preventDefault()">How it works</a></li>
          <li><a href="#report" (click)="scrollToSection('report'); $event.preventDefault()">Report</a></li>
          <li><a href="#features" (click)="scrollToSection('features'); $event.preventDefault()">Features</a></li>
          <li><a href="/login" class="nav-btn">Login</a></li>
        </ul>
      </nav>
 
      <!-- HERO -->
      <section class="hero">
        <!-- Background grid -->
        <div class="hero-grid"></div>
        <!-- Glow orbs -->
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
 
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-dot"></span>
            Community-Powered Cleanliness
          </div>
 
          <h1 class="hero-title">
            A cleaner future<br>
            starts with <em>you.</em>
          </h1>
 
          <p class="hero-sub">
            Empower your community to report, track, and resolve waste issues faster with intelligent tools.
          </p>
 
          <div class="hero-cta">
            <button class="btn-primary" (click)="goToReport()">
              <span class="btn-icon">▶</span>
              Report Issue
            </button>
            <a href="#how" class="btn-ghost" (click)="scrollToSection('how'); $event.preventDefault()">Learn More</a>
          </div>
 
          <!-- Stats -->
          <div class="hero-stats">
            <div class="stat-card">
              <div class="stat-num">1,200+</div>
              <div class="stat-label">Reports</div>
            </div>
            <div class="stat-card">
              <div class="stat-num">85%</div>
              <div class="stat-label">Resolved</div>
            </div>
            <div class="stat-card">
              <div class="stat-num">24h</div>
              <div class="stat-label">Response</div>
            </div>
          </div>
        </div>
      </section>
 
      <!-- HOW IT WORKS -->
      <section class="section" id="how">
        <div class="section-inner">
          <div class="section-label">Process</div>
          <h2 class="section-title">From report to resolution<br>in 3 steps</h2>
          <div class="steps">
            <div class="step">
              <div class="step-num">01</div>
              <h3>Spot &amp; Report</h3>
              <p>See trash or illegal dumping? Fill out a quick report with the location, photos, and severity level. Takes less than 2 minutes.</p>
            </div>
            <div class="step-divider"></div>
            <div class="step">
              <div class="step-num">02</div>
              <h3>City Hall Review</h3>
              <p>Your report is instantly sent to the City Hall sanitation dashboard. Staff triage and assign cleanup teams based on urgency.</p>
            </div>
            <div class="step-divider"></div>
            <div class="step">
              <div class="step-num">03</div>
              <h3>Track &amp; Resolve</h3>
              <p>Get real-time updates on your report's status — from Pending to In Progress to Resolved. Your reference ID keeps you in the loop.</p>
            </div>
          </div>
        </div>
      </section>
 
      <!-- REPORT SECTION -->
      <section class="report-section" id="report">
        <div class="section-inner report-grid">
          <div class="report-intro">
            <div class="section-label">Report an Issue</div>
            <h2 class="section-title">Help keep your<br>community clean</h2>
            <p class="report-desc">Follow these simple steps to report waste issues in your area. Every report makes a difference!</p>
            <div class="checklist">
              <div class="check-item"><span class="check">✓</span> Reports reviewed within 24 hours</div>
              <div class="check-item"><span class="check">✓</span> Real-time status tracking</div>
              <div class="check-item"><span class="check">✓</span> Anonymous reporting available</div>
              <div class="check-item"><span class="check">✓</span> Photo evidence supported</div>
            </div>
          </div>
          <div class="report-guide">
            <div class="step-guide">
              <h3 class="guide-title">How to Report an Issue</h3>
              
              <div class="guide-step">
                <div class="step-number">1</div>
                <div class="step-content">
                  <h4>Sign In or Report Anonymously</h4>
                  <p>Choose to create an account for tracking or submit anonymously for privacy.</p>
                  <button class="step-btn" (click)="goToLogin()">
                    <span class="btn-icon">👤</span>
                    Sign In to Report
                  </button>
                </div>
              </div>

              <div class="guide-step">
                <div class="step-number">2</div>
                <div class="step-content">
                  <h4>Describe the Issue</h4>
                  <p>Provide details about the waste problem - type, severity, and any important information.</p>
                  <div class="step-preview">
                    <div class="preview-field">
                      <span class="field-label">Issue Type:</span>
                      <span class="field-value">Illegal Dumping</span>
                    </div>
                    <div class="preview-field">
                      <span class="field-label">Severity:</span>
                      <span class="field-value">High</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="guide-step">
                <div class="step-number">3</div>
                <div class="step-content">
                  <h4>Add Location</h4>
                  <p>Pin the exact location on the map or enter the address where the issue is located.</p>
                  <div class="step-preview">
                    <div class="map-preview">
                      <div class="preview-map">
                        <div class="preview-pin">📍</div>
                        <span class="map-text">Click to set location</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="guide-step">
                <div class="step-number">4</div>
                <div class="step-content">
                  <h4>Upload Photos</h4>
                  <p>Take clear photos of the waste issue to help authorities understand the problem better.</p>
                  <div class="step-preview">
                    <div class="photo-preview">
                      <div class="preview-photo">
                        <span class="photo-icon">📷</span>
                        <span class="photo-text">Add photos</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="guide-step">
                <div class="step-number">5</div>
                <div class="step-content">
                  <h4>Submit & Track</h4>
                  <p>Submit your report and get a reference number to track the cleanup progress.</p>
                  <div class="step-preview">
                    <div class="submit-preview">
                      <div class="reference-number">
                        <span class="ref-label">Reference:</span>
                        <span class="ref-value">#CT-2024-001</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="guide-cta">
                <button class="btn-primary" (click)="goToLogin()">
                  <span class="btn-icon">▶</span>
                  Start Reporting Now
                </button>
                <p class="cta-note">Join hundreds of residents making their community cleaner!</p>
              </div>
            </div>
          </div>
        </div>
      </section>
 
      <!-- FEATURES -->
      <section class="section" id="features">
        <div class="section-inner">
          <div class="section-label">Features</div>
          <h2 class="section-title">Everything your<br>community needs</h2>
          <div class="features-grid">
            <div class="feature">
              <div class="feature-icon">🗺️</div>
              <h3>Live Issue Map</h3>
              <p>See all active reports on a live map. Color-coded pins show severity at a glance.</p>
            </div>
            <div class="feature">
              <div class="feature-icon">🔔</div>
              <h3>Real-Time Updates</h3>
              <p>Get notified when your report status changes. Know exactly when City Hall acts.</p>
            </div>
            <div class="feature">
              <div class="feature-icon">📊</div>
              <h3>Analytics Dashboard</h3>
              <p>Administrators access powerful dashboards showing trends, hotspots, and metrics.</p>
            </div>
            <div class="feature">
              <div class="feature-icon">📱</div>
              <h3>Mobile-First</h3>
              <p>Report issues from anywhere. Snap a photo, drop a pin, submit in under 2 minutes.</p>
            </div>
            <div class="feature">
              <div class="feature-icon">🔒</div>
              <h3>Anonymous Reports</h3>
              <p>Submit without sharing personal details. We protect community members who speak up.</p>
            </div>
            <div class="feature">
              <div class="feature-icon">🤝</div>
              <h3>Team Assignment</h3>
              <p>City Hall assigns reports to cleanup crews, sets priorities, tracks resolution progress.</p>
            </div>
          </div>
        </div>
      </section>
 
      <!-- CTA -->
      <section class="cta-section">
        <div class="cta-orb"></div>
        <div class="cta-inner">
          <div class="section-label" style="text-align:center;margin-bottom:24px;">Start Today — It's Free</div>
          <h2 class="cta-title">A cleaner community<br>starts with <em>you.</em></h2>
          <p class="cta-sub">Join hundreds of residents already making their barangay cleaner. Every report brings us one step closer to a healthier city.</p>
          <div class="cta-actions">
            <button class="btn-primary" (click)="goToReport()">▶ Report an Issue Now</button>
            <button class="btn-ghost" (click)="goToLogin()">Login →</button>
          </div>
        </div>
      </section>
 
      <!-- FOOTER -->
      <footer class="footer">
        <div class="footer-logo">Clean<span>Track</span></div>
        <div class="footer-copy">Made for cleaner communities ✦ © 2026 CleanTrack</div>
      </footer>
 
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&family=Satoshi:wght@300;400;500&display=swap');
 
    :host {
      --green: #22c55e;
      --green-dim: #16a34a;
      --green-glow: rgba(34,197,94,0.15);
      --green-glow-strong: rgba(34,197,94,0.25);
      --dark: #050f08;
      --dark-2: #0a1a0f;
      --dark-3: #0f2318;
      --surface: #0d1f13;
      --border: rgba(34,197,94,0.12);
      --border-hover: rgba(34,197,94,0.3);
      --text: #e2ede6;
      --text-muted: #6b8f76;
      --white: #f0faf3;
    }
 
    * { box-sizing: border-box; margin: 0; padding: 0; }
 
    .landing {
      font-family: 'Satoshi', sans-serif;
      background: var(--dark);
      color: var(--text);
      overflow-x: hidden;
      min-height: 100vh;
    }
 
    /* ── NAV ── */
    .nav {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 48px;
      background: rgba(5,15,8,0.8);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border);
    }
 
    .nav-logo {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: 'Cabinet Grotesk', sans-serif;
      font-weight: 800;
      font-size: 1.3rem;
      color: var(--white);
      text-decoration: none;
      letter-spacing: -0.02em;
    }
 
    .logo-leaf {
      color: var(--green);
      font-size: 1rem;
    }
 
    .nav-links {
      display: flex;
      align-items: center;
      gap: 32px;
      list-style: none;
    }
 
    .nav-links a {
      color: var(--text-muted);
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      transition: color 0.2s;
    }
 
    .nav-links a:hover { color: var(--green); }
 
    .nav-btn {
      background: var(--green) !important;
      color: #050f08 !important;
      padding: 9px 22px;
      border-radius: 100px;
      font-weight: 700 !important;
      font-size: 0.85rem !important;
      transition: box-shadow 0.2s, transform 0.2s !important;
      text-decoration: none;
    }
 
    .nav-btn:hover {
      box-shadow: 0 0 24px var(--green-glow-strong) !important;
      transform: translateY(-1px);
      color: #050f08 !important;
    }
 
    /* ── HERO ── */
    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      padding: 120px 48px 80px;
      text-align: center;
      overflow: hidden;
    }
 
    .hero-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px);
      background-size: 60px 60px;
    }
 
    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      pointer-events: none;
    }
 
    .orb-1 {
      width: 500px; height: 500px;
      background: radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%);
      top: -100px; right: -100px;
      animation: orb-float 8s ease-in-out infinite;
    }
 
    .orb-2 {
      width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%);
      bottom: 0; left: -80px;
      animation: orb-float 10s ease-in-out infinite reverse;
    }
 
    @keyframes orb-float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-30px); }
    }
 
    .hero-content {
      position: relative;
      z-index: 2;
      max-width: 800px;
      animation: fade-up 0.8s ease both;
    }
 
    @keyframes fade-up {
      from { opacity: 0; transform: translateY(30px); }
      to   { opacity: 1; transform: translateY(0); }
    }
 
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(34,197,94,0.08);
      border: 1px solid var(--border);
      color: var(--green);
      padding: 7px 16px;
      border-radius: 100px;
      font-size: 0.75rem;
      font-weight: 500;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      margin-bottom: 32px;
    }
 
    .badge-dot {
      width: 6px; height: 6px;
      background: var(--green);
      border-radius: 50%;
      animation: pulse 2s ease-in-out infinite;
    }
 
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.8); }
    }
 
    .hero-title {
      font-family: 'Cabinet Grotesk', sans-serif;
      font-size: clamp(3.5rem, 8vw, 6.5rem);
      font-weight: 900;
      line-height: 1.0;
      letter-spacing: -0.04em;
      color: var(--white);
      margin-bottom: 24px;
    }
 
    .hero-title em {
      font-style: normal;
      color: var(--green);
      position: relative;
    }
 
    .hero-sub {
      font-size: 1.1rem;
      color: var(--text-muted);
      max-width: 520px;
      line-height: 1.7;
      margin: 0 auto 40px;
      font-weight: 400;
    }
 
    .hero-cta {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      margin-bottom: 72px;
    }
 
    /* ── STATS ── */
    .hero-stats {
      display: flex;
      justify-content: center;
      gap: 20px;
      flex-wrap: wrap;
    }
 
    .stat-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 24px 40px;
      text-align: center;
      transition: border-color 0.3s, transform 0.3s;
      min-width: 150px;
    }
 
    .stat-card:hover {
      border-color: var(--border-hover);
      transform: translateY(-3px);
    }
 
    .stat-num {
      font-family: 'Cabinet Grotesk', sans-serif;
      font-size: 2.2rem;
      font-weight: 900;
      color: var(--green);
      letter-spacing: -0.03em;
      line-height: 1;
      margin-bottom: 6px;
    }
 
    .stat-label {
      font-size: 0.8rem;
      color: var(--text-muted);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
 
    /* ── BUTTONS ── */
    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--green);
      color: #050f08;
      padding: 15px 32px;
      border-radius: 100px;
      font-family: 'Cabinet Grotesk', sans-serif;
      font-weight: 700;
      font-size: 0.95rem;
      border: none;
      cursor: pointer;
      transition: box-shadow 0.2s, transform 0.2s;
      letter-spacing: -0.01em;
    }
 
    .btn-primary:hover {
      box-shadow: 0 0 32px var(--green-glow-strong);
      transform: translateY(-2px);
    }
 
    .btn-icon { font-size: 0.7rem; }
 
    .btn-ghost {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: transparent;
      color: var(--text);
      padding: 15px 28px;
      border-radius: 100px;
      font-family: 'Cabinet Grotesk', sans-serif;
      font-weight: 600;
      font-size: 0.95rem;
      border: 1px solid rgba(255,255,255,0.1);
      cursor: pointer;
      text-decoration: none;
      transition: border-color 0.2s, background 0.2s;
    }
 
    .btn-ghost:hover {
      border-color: rgba(255,255,255,0.25);
      background: rgba(255,255,255,0.04);
    }
 
    /* ── SECTIONS ── */
    .section {
      padding: 100px 0;
    }
 
    .section-inner {
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 48px;
    }
 
    .section-label {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      color: var(--green);
      margin-bottom: 16px;
    }
 
    .section-title {
      font-family: 'Cabinet Grotesk', sans-serif;
      font-size: clamp(2.2rem, 4vw, 3.2rem);
      font-weight: 900;
      line-height: 1.05;
      letter-spacing: -0.03em;
      color: var(--white);
      margin-bottom: 60px;
    }
 
    /* ── STEPS ── */
    .steps {
      display: flex;
      align-items: flex-start;
      gap: 0;
    }
 
    .step {
      flex: 1;
      padding: 40px 32px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 20px;
      transition: border-color 0.3s, transform 0.3s;
    }
 
    .step:hover {
      border-color: var(--border-hover);
      transform: translateY(-4px);
    }
 
    .step-divider {
      width: 40px;
      flex-shrink: 0;
      height: 1px;
      background: var(--border);
      margin-top: 60px;
      align-self: flex-start;
    }
 
    .step-num {
      font-family: 'Cabinet Grotesk', sans-serif;
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--green);
      letter-spacing: 0.1em;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
 
    .step-num::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--border);
      display: block;
    }
 
    .step h3 {
      font-family: 'Cabinet Grotesk', sans-serif;
      font-size: 1.2rem;
      font-weight: 800;
      color: var(--white);
      margin-bottom: 12px;
      letter-spacing: -0.02em;
    }
 
    .step p {
      font-size: 0.875rem;
      color: var(--text-muted);
      line-height: 1.7;
      font-weight: 400;
    }
 
    /* ── REPORT SECTION ── */
    .report-section {
      padding: 100px 0;
      background: var(--dark-2);
      border-top: 1px solid var(--border);
      border-bottom: 1px solid var(--border);
    }
 
    .report-grid {
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      gap: 80px;
      align-items: start;
    }
 
    .report-intro .section-title { margin-bottom: 20px; }
 
    .report-desc {
      color: var(--text-muted);
      font-size: 0.95rem;
      line-height: 1.7;
      margin-bottom: 36px;
    }
 
    .checklist {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
 
    .check-item {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 0.875rem;
      color: var(--text-muted);
    }
 
    .check {
      color: var(--green);
      font-size: 0.9rem;
      font-weight: 700;
    }
 
    /* Step Guide Styles */
    .report-guide {
      background: var(--dark-3);
      border: 1px solid var(--border);
      border-radius: 24px;
      padding: 40px;
      overflow: hidden;
    }
 
    .guide-title {
      font-family: 'Cabinet Grotesk', sans-serif;
      font-size: 1.3rem;
      font-weight: 700;
      color: var(--white);
      margin-bottom: 32px;
      text-align: center;
    }
 
    .guide-step {
      display: flex;
      gap: 20px;
      margin-bottom: 32px;
      padding-bottom: 32px;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
 
    .guide-step:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
 
    .step-number {
      width: 40px;
      height: 40px;
      background: var(--green);
      color: var(--dark);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Cabinet Grotesk', sans-serif;
      font-weight: 800;
      font-size: 1rem;
      flex-shrink: 0;
    }
 
    .step-content {
      flex: 1;
    }
 
    .step-content h4 {
      font-family: 'Cabinet Grotesk', sans-serif;
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--white);
      margin-bottom: 8px;
    }
 
    .step-content p {
      color: var(--text-muted);
      font-size: 0.9rem;
      line-height: 1.5;
      margin-bottom: 16px;
    }
 
    .step-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--green);
      color: var(--dark);
      padding: 10px 20px;
      border-radius: 100px;
      font-family: 'Cabinet Grotesk', sans-serif;
      font-weight: 600;
      font-size: 0.85rem;
      border: none;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
 
    .step-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(57, 224, 122, 0.3);
    }
 
    .step-preview {
      margin-top: 12px;
    }
 
    .preview-field {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 8px;
      padding: 10px 14px;
      margin-bottom: 8px;
    }
 
    .field-label {
      font-size: 0.8rem;
      color: var(--text-muted);
      font-weight: 500;
    }
 
    .field-value {
      font-size: 0.85rem;
      color: var(--green);
      font-weight: 600;
    }
 
    .preview-map {
      border-radius: 12px;
      overflow: hidden;
    }
 
    .preview-map {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      position: relative;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
 
    .preview-pin {
      font-size: 1.2rem;
      margin-right: 8px;
    }
 
    .map-text {
      color: var(--text-muted);
      font-size: 0.85rem;
    }
 
    .preview-photo {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
 
    .photo-icon {
      font-size: 1.2rem;
      margin-right: 8px;
    }
 
    .photo-text {
      color: var(--text-muted);
      font-size: 0.85rem;
    }
 
    .reference-number {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 8px;
      padding: 12px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
 
    .ref-label {
      font-size: 0.8rem;
      color: var(--text-muted);
      font-weight: 500;
    }
 
    .ref-value {
      font-size: 0.9rem;
      color: var(--green);
      font-weight: 700;
      font-family: 'Cabinet Grotesk', sans-serif;
    }
 
    .guide-cta {
      text-align: center;
      margin-top: 32px;
      padding-top: 32px;
      border-top: 1px solid rgba(255,255,255,0.1);
    }
 
    .guide-cta .btn-primary {
      margin-bottom: 16px;
    }
 
    .cta-note {
      color: var(--text-muted);
      font-size: 0.85rem;
      margin: 0;
    }
 
    /* ── FEATURES ── */
    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
 
    .feature {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 32px;
      transition: border-color 0.3s, transform 0.3s;
      position: relative;
      overflow: hidden;
    }
 
    .feature::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(34,197,94,0.4), transparent);
      opacity: 0;
      transition: opacity 0.3s;
    }
 
    .feature:hover {
      border-color: var(--border-hover);
      transform: translateY(-4px);
    }
 
    .feature:hover::before { opacity: 1; }
 
    .feature-icon {
      font-size: 1.5rem;
      margin-bottom: 16px;
      display: block;
    }
 
    .feature h3 {
      font-family: 'Cabinet Grotesk', sans-serif;
      font-size: 1.05rem;
      font-weight: 800;
      color: var(--white);
      margin-bottom: 10px;
      letter-spacing: -0.02em;
    }
 
    .feature p {
      font-size: 0.85rem;
      color: var(--text-muted);
      line-height: 1.65;
    }
 
    /* ── CTA ── */
    .cta-section {
      padding: 120px 48px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
 
    .cta-orb {
      position: absolute;
      width: 600px; height: 600px;
      background: radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%);
      border-radius: 50%;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
    }
 
    .cta-inner {
      position: relative;
      z-index: 2;
      max-width: 640px;
      margin: 0 auto;
    }
 
    .cta-title {
      font-family: 'Cabinet Grotesk', sans-serif;
      font-size: clamp(2.5rem, 5vw, 4rem);
      font-weight: 900;
      line-height: 1.0;
      letter-spacing: -0.04em;
      color: var(--white);
      margin-bottom: 20px;
    }
 
    .cta-title em { font-style: normal; color: var(--green); }
 
    .cta-sub {
      color: var(--text-muted);
      font-size: 1rem;
      line-height: 1.65;
      margin-bottom: 40px;
    }
 
    .cta-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }
 
    /* ── FOOTER ── */
    .footer {
      padding: 40px 48px;
      border-top: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
 
    .footer-logo {
      font-family: 'Cabinet Grotesk', sans-serif;
      font-weight: 900;
      font-size: 1.1rem;
      color: var(--white);
      letter-spacing: -0.02em;
    }
 
    .footer-logo span { color: var(--green); }
 
    .footer-copy {
      font-size: 0.8rem;
      color: var(--text-muted);
    }
 
    /* ── RESPONSIVE ── */
    @media (max-width: 1024px) {
      .steps { flex-direction: column; gap: 16px; }
      .step-divider { display: none; }
      .features-grid { grid-template-columns: repeat(2, 1fr); }
      .report-grid { grid-template-columns: 1fr; }
    }
 
    @media (max-width: 768px) {
      .nav { padding: 16px 24px; }
      .nav-links { gap: 20px; }
      .nav-links li:not(:last-child) { display: none; }
      .hero { padding: 100px 24px 60px; }
      .section { padding: 64px 0; }
      .section-inner { padding: 0 24px; }
      .features-grid { grid-template-columns: 1fr; }
      .cta-section { padding: 80px 24px; }
      .footer { flex-direction: column; gap: 12px; text-align: center; padding: 32px 24px; }
    }
  `]
})
export class LandingComponent {
  constructor(private router: Router) {}
 
  goToReport() { 
    // Navigate to login first, then user can report
    this.router.navigate(['/login']); 
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
