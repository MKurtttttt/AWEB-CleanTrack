import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReportForm } from '../report-form/report-form';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, ReportForm],
  template: `
    <div class="landing-container">

      <!-- NAV -->
      <nav class="navbar">
        <a href="#" class="nav-logo">
          <div class="logo-icon">🌿</div>
          CleanTrack
        </a>
        <ul class="nav-links">
          <li><a href="#how">How it works</a></li>
          <li><a href="#report">Report</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="/login" class="nav-cta">Login</a></li>
        </ul>
      </nav>

      <!-- HERO -->
      <section class="hero">
        <div class="hero-badge">🌍 Community-Powered Cleanliness</div>
        <h1>Your community<br>deserves to be <em>clean.</em></h1>
        <p class="hero-sub">Report trash, illegal dumping, and waste in your neighborhood. CleanTrack routes your reports directly to City Hall for swift action.</p>
        <div class="hero-actions">
          <button class="btn-primary" (click)="goToReport()">📍 Report an Issue</button>
          <a href="#how" class="btn-secondary">See how it works →</a>
        </div>
        <div class="hero-stats">
          <div class="stat">
            <div class="stat-num">1,<span>2</span>48</div>
            <div class="stat-label">Reports filed</div>
          </div>
          <div class="stat">
            <div class="stat-num"><span>87</span>%</div>
            <div class="stat-label">Resolved within 72h</div>
          </div>
          <div class="stat">
            <div class="stat-num"><span>14</span></div>
            <div class="stat-label">Barangays covered</div>
          </div>
        </div>

        <!-- Floating Map Card -->
        <div class="hero-visual">
          <div class="map-card">
            <div class="map-header">
              <span class="map-title">Live Issue Map</span>
              <span class="live-badge"><span class="live-dot"></span> Live</span>
            </div>
            <div class="map-body">
              <div class="map-pin pin-red" style="top:30%; left:30%">
                <div class="pin-icon"><span>🗑️</span></div>
                <div class="pin-label">Illegal dumping</div>
              </div>
              <div class="map-pin pin-yellow" style="top:55%; left:58%">
                <div class="pin-icon"><span>♻️</span></div>
                <div class="pin-label">Overflow bin</div>
              </div>
              <div class="map-pin pin-green" style="top:20%; left:65%">
                <div class="pin-icon"><span>✅</span></div>
                <div class="pin-label">Resolved</div>
              </div>
              <div class="map-pin pin-red" style="top:70%; left:22%">
                <div class="pin-icon"><span>⚠️</span></div>
                <div class="pin-label">Hazardous waste</div>
              </div>
            </div>
            <div class="map-report-list">
              <div class="report-item">
                <div class="report-dot" style="background:var(--danger)"></div>
                <div class="report-info">
                  <div class="report-name">Illegal Dumping</div>
                  <div class="report-loc">📍 Rizal St. cor. Mabini Ave.</div>
                </div>
                <span class="report-status status-urgent">Urgent</span>
              </div>
              <div class="report-item">
                <div class="report-dot" style="background:var(--warning)"></div>
                <div class="report-info">
                  <div class="report-name">Overflowing Bin</div>
                  <div class="report-loc">📍 Magsaysay Market</div>
                </div>
                <span class="report-status status-pending">Pending</span>
              </div>
              <div class="report-item">
                <div class="report-dot" style="background:var(--green-neon)"></div>
                <div class="report-info">
                  <div class="report-name">Scattered Litter</div>
                  <div class="report-loc">📍 Plaza Complex</div>
                </div>
                <span class="report-status status-resolved">Resolved</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- HOW IT WORKS -->
      <section class="section" id="how">
        <div class="section-label">Process</div>
        <h2 class="section-title">From report to resolution in 3 steps</h2>
        <div class="steps">
          <div class="step">
            <div class="step-num">01</div>
            <h3>Spot &amp; Report</h3>
            <p>See trash or illegal dumping in your community? Fill out a quick report with the location, photos, and severity level. Takes less than 2 minutes.</p>
          </div>
          <div class="step">
            <div class="step-num">02</div>
            <h3>City Hall Review</h3>
            <p>Your report is instantly sent to the City Hall sanitation dashboard. Staff triage and assign cleanup teams based on urgency and location.</p>
          </div>
          <div class="step">
            <div class="step-num">03</div>
            <h3>Track &amp; Resolve</h3>
            <p>Get real-time updates on your report's status — from "Pending" to "In Progress" to "Resolved." Your reference ID keeps you in the loop.</p>
          </div>
        </div>
      </section>

      <!-- REPORT FORM -->
      <section class="report-section" id="report">
        <div class="report-grid">
          <div class="report-intro">
            <div class="section-label">Report an Issue</div>
            <h2 class="section-title" style="font-size:2.2rem;">Help keep your<br>community clean</h2>
            <p class="intro-body">Every report you file goes directly to the City Hall sanitation team. Your information is kept anonymous if preferred. Together, we can build a cleaner, healthier city.</p>
            <div class="intro-checklist">
              <div class="check-item"><span class="check-icon">✓</span> Reports reviewed within 24 hours</div>
              <div class="check-item"><span class="check-icon">✓</span> Real-time status tracking</div>
              <div class="check-item"><span class="check-icon">✓</span> Anonymous reporting available</div>
              <div class="check-item"><span class="check-icon">✓</span> Photo evidence supported</div>
            </div>
          </div>

          <div class="report-form">
            <app-report-form></app-report-form>
          </div>
        </div>
      </section>

      <!-- FEATURES -->
      <section class="section" id="features">
        <div class="section-label">Features</div>
        <h2 class="section-title">Everything your community needs</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🗺️</div>
            <h3>Interactive Issue Map</h3>
            <p>See all active reports plotted on a live map of your city. Color-coded pins show severity at a glance — red for urgent, yellow for pending, green for resolved.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔔</div>
            <h3>Real-Time Status Updates</h3>
            <p>Get notified by email or SMS when your report status changes. Know exactly when City Hall receives, reviews, and resolves your issue.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>City Hall Analytics</h3>
            <p>Administrators access powerful dashboards showing report trends, hotspot barangays, team performance metrics, and resolution time analytics.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h3>Mobile-First Design</h3>
            <p>Report issues from anywhere — CleanTrack is fully optimized for mobile. Snap a photo, drop a pin, and submit in under 2 minutes, right from the scene.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔒</div>
            <h3>Anonymous Reporting</h3>
            <p>Concerned about privacy? Submit reports without sharing personal details. We protect community members who speak up about waste issues.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🤝</div>
            <h3>Team Assignment</h3>
            <p>City Hall can assign reports to specific cleanup crews, set priorities, add internal notes, and track resolution progress — all in one place.</p>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="cta-section">
        <div class="cta-box">
          <div class="hero-badge" style="margin:0 auto 20px;">🌿 Start Today — It's Free</div>
          <h2>A cleaner community starts with <em style="color:var(--green-neon);font-style:normal;">you.</em></h2>
          <p>Join hundreds of residents already making their barangay cleaner. Every report you file brings us one step closer to a healthier city.</p>
          <div class="cta-actions">
            <button class="btn-primary" (click)="goToReport()">📍 Report an Issue Now</button>
            <button class="btn-secondary" (click)="goToLogin()">🏛️ Login →</button>
          </div>
        </div>
      </section>

      <!-- FOOTER -->
      <footer class="footer">
        <div class="footer-logo">Clean<span>Track</span> <span class="footer-sub">Community Cleanliness Reporter</span></div>
        <div>Made for cleaner communities 🌿</div>
        <div>© 2026 CleanTrack</div>
      </footer>

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

    /* ── GLOBAL ── */
    .landing-container {
      font-family: 'DM Sans', sans-serif;
      background: var(--dark);
      color: var(--text);
      overflow-x: hidden;
      min-height: 100vh;
      position: relative;
    }

    /* ── NAV ── */
    .navbar {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 200;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 48px;
      background: rgba(13, 31, 20, 0.85);
      backdrop-filter: blur(24px);
      border-bottom: 1px solid rgba(57, 224, 122, 0.08);
    }

    .nav-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: 'Syne', sans-serif;
      font-weight: 800;
      font-size: 1.4rem;
      color: var(--white);
      text-decoration: none;
    }

    .logo-icon {
      width: 36px; height: 36px;
      background: linear-gradient(135deg, var(--green-neon), var(--green));
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 36px;
      list-style: none;
      margin: 0; padding: 0;
    }

    .nav-links a {
      color: var(--text-muted);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      letter-spacing: 0.02em;
      transition: color 0.2s;
    }

    .nav-links a:hover { color: var(--green-neon); }

    .nav-cta {
      background: var(--green-neon) !important;
      color: var(--dark) !important;
      padding: 10px 22px;
      border-radius: 50px;
      font-weight: 600 !important;
      transition: transform 0.2s, box-shadow 0.2s !important;
    }

    .nav-cta:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 24px rgba(57, 224, 122, 0.35) !important;
    }

    /* ── HERO ── */
    .hero {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 120px 48px 80px;
      position: relative;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(57, 224, 122, 0.1);
      border: 1px solid rgba(57, 224, 122, 0.25);
      color: var(--green-neon);
      padding: 8px 16px;
      border-radius: 50px;
      font-size: 0.8rem;
      font-weight: 500;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      width: fit-content;
      margin-bottom: 28px;
    }

    .hero h1 {
      font-family: 'Syne', sans-serif;
      font-size: clamp(3.2rem, 7vw, 6.5rem);
      font-weight: 800;
      line-height: 1.0;
      letter-spacing: -0.03em;
      max-width: 900px;
    }

    .hero h1 em { font-style: normal; color: var(--green-neon); }

    .hero-sub {
      font-size: 1.15rem;
      color: var(--text-muted);
      max-width: 520px;
      line-height: 1.7;
      margin-top: 24px;
      font-weight: 300;
    }

    .hero-actions {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-top: 40px;
    }

    .hero-stats {
      display: flex;
      gap: 48px;
      margin-top: 72px;
      padding-top: 40px;
      border-top: 1px solid rgba(255,255,255,0.07);
    }

    .stat-num {
      font-family: 'Syne', sans-serif;
      font-size: 2rem;
      font-weight: 800;
      color: var(--white);
      line-height: 1;
    }

    .stat-num span { color: var(--green-neon); }

    .stat-label {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-top: 4px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    /* ── FLOATING MAP CARD ── */
    .hero-visual {
      position: absolute;
      right: 48px;
      top: 50%;
      transform: translateY(-50%);
      width: 420px;
    }

    .map-card {
      background: var(--dark-2);
      border: 1px solid rgba(57, 224, 122, 0.15);
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 40px 80px rgba(0,0,0,0.5);
    }

    .map-header {
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }

    .map-title {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .live-badge {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 0.7rem;
      color: var(--green-neon);
      font-weight: 600;
    }

    .live-dot {
      width: 6px; height: 6px;
      background: var(--green-neon);
      border-radius: 50%;
    }

    .map-body {
      height: 240px;
      background:
        linear-gradient(rgba(57,224,122,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(57,224,122,0.03) 1px, transparent 1px);
      background-size: 30px 30px;
      background-color: #101d15;
      position: relative;
      overflow: hidden;
    }

    .map-body::before {
      content: '';
      position: absolute; inset: 0;
      background:
        linear-gradient(rgba(57,224,122,0.08) 2px, transparent 2px),
        linear-gradient(90deg, rgba(57,224,122,0.08) 2px, transparent 2px);
      background-size: 90px 90px;
      background-position: 45px 45px;
    }

    .map-pin {
      position: absolute;
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .map-pin:hover { transform: translateY(-4px); }

    .pin-icon {
      width: 32px; height: 32px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex; align-items: center; justify-content: center;
      font-size: 14px;
    }

    .pin-icon span { transform: rotate(45deg); display: block; }

    .pin-red .pin-icon    { background: var(--danger);   box-shadow: 0 4px 16px rgba(232,92,58,0.5); }
    .pin-yellow .pin-icon { background: var(--warning);  box-shadow: 0 4px 16px rgba(240,165,0,0.5); }
    .pin-green .pin-icon  { background: var(--green-neon); box-shadow: 0 4px 16px rgba(57,224,122,0.5); }

    .pin-label {
      margin-top: 4px;
      background: rgba(0,0,0,0.7);
      color: white;
      font-size: 0.65rem;
      padding: 2px 8px;
      border-radius: 50px;
      white-space: nowrap;
      font-weight: 500;
    }

    .map-report-list {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .report-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      background: rgba(255,255,255,0.03);
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.05);
      transition: border-color 0.2s;
    }

    .report-item:hover { border-color: rgba(57,224,122,0.2); }

    .report-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .report-info { flex: 1; }
    .report-name { font-size: 0.8rem; font-weight: 500; }
    .report-loc  { font-size: 0.7rem; color: var(--text-muted); margin-top: 1px; }

    .report-status {
      font-size: 0.65rem;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 50px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .status-pending  { background: rgba(240,165,0,0.15);  color: var(--warning); }
    .status-resolved { background: rgba(57,224,122,0.12); color: var(--green-neon); }
    .status-urgent   { background: rgba(232,92,58,0.12);  color: var(--danger); }

    /* ── SECTIONS ── */
    .section { padding: 100px 48px; }

    .section-label {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: var(--green-neon);
      margin-bottom: 16px;
    }

    .section-title {
      font-family: 'Syne', sans-serif;
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 800;
      line-height: 1.1;
      letter-spacing: -0.02em;
      max-width: 600px;
    }

    /* ── STEPS ── */
    .steps {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      margin-top: 60px;
      position: relative;
    }

    .steps::before {
      content: '';
      position: absolute;
      top: 36px; left: calc(16.6% + 24px); right: calc(16.6% + 24px);
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(57,224,122,0.3) 20%, rgba(57,224,122,0.3) 80%, transparent);
    }

    .step {
      background: var(--dark-2);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: var(--radius);
      padding: 32px;
      transition: border-color 0.3s, transform 0.3s;
    }

    .step:hover { border-color: rgba(57,224,122,0.2); transform: translateY(-4px); }

    .step-num {
      width: 48px; height: 48px;
      border-radius: 14px;
      background: linear-gradient(135deg, var(--green), var(--dark-2));
      border: 1px solid rgba(57,224,122,0.3);
      display: flex; align-items: center; justify-content: center;
      font-family: 'Syne', sans-serif;
      font-weight: 800;
      font-size: 1.1rem;
      color: var(--green-neon);
      margin-bottom: 20px;
    }

    .step h3 { font-family: 'Syne', sans-serif; font-size: 1.15rem; font-weight: 700; margin-bottom: 10px; }
    .step p  { font-size: 0.88rem; color: var(--text-muted); line-height: 1.65; }

    /* ── REPORT SECTION ── */
    .report-section {
      padding: 80px 48px;
      background: var(--dark-2);
      position: relative;
    }

    .report-grid {
      display: grid;
      grid-template-columns: 1fr 1.2fr;
      gap: 64px;
      align-items: start;
      max-width: 1100px;
    }

    .intro-body {
      color: var(--text-muted);
      font-size: 0.92rem;
      line-height: 1.7;
      margin-top: 20px;
    }

    .intro-checklist { margin-top: 36px; display: flex; flex-direction: column; gap: 14px; }

    .check-item { display: flex; align-items: center; gap: 12px; font-size: 0.88rem; color: var(--text-muted); }
    .check-icon { color: var(--green-neon); font-size: 1.1rem; }

    .report-form {
      background: var(--dark);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 24px;
      padding: 36px;
    }

    .form-title {
      font-family: 'Syne', sans-serif;
      font-size: 1.3rem;
      font-weight: 700;
      margin-bottom: 28px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .form-title-icon {
      width: 36px; height: 36px;
      background: rgba(57,224,122,0.12);
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px;
    }

    .form-group { margin-bottom: 20px; }

    .form-label {
      display: block;
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--text-muted);
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .form-input, .form-select, .form-textarea {
      width: 100%;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px;
      padding: 13px 16px;
      color: var(--text);
      font-family: 'DM Sans', sans-serif;
      font-size: 0.9rem;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      -webkit-appearance: none;
      appearance: none;
    }

    .form-input:focus, .form-select:focus, .form-textarea:focus {
      border-color: rgba(57,224,122,0.4);
      box-shadow: 0 0 0 3px rgba(57,224,122,0.08);
    }

    .form-input::placeholder, .form-textarea::placeholder { color: rgba(138,171,151,0.5); }
    .form-select option { background: var(--dark-2); }
    .form-textarea { resize: vertical; min-height: 100px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

    .upload-zone {
      border: 2px dashed rgba(255,255,255,0.1);
      border-radius: 12px;
      padding: 28px;
      text-align: center;
      cursor: pointer;
      transition: border-color 0.2s, background 0.2s;
    }

    .upload-zone:hover {
      border-color: rgba(57,224,122,0.35);
      background: rgba(57,224,122,0.03);
    }

    .upload-icon { font-size: 2rem; margin-bottom: 8px; }
    .upload-text { font-size: 0.85rem; color: var(--text-muted); }
    .upload-text strong { color: var(--green-neon); }

    .severity-picker { display: flex; gap: 10px; }

    .severity-opt {
      flex: 1;
      padding: 10px;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.08);
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .sev-icon { font-size: 1.2rem; display: block; margin-bottom: 4px; }

    .severity-opt.low    { color: var(--green-neon); }
    .severity-opt.medium { color: var(--warning); }
    .severity-opt.high   { color: var(--danger); }

    .severity-opt.low.active,    .severity-opt.low:hover    { background: rgba(57,224,122,0.1); border-color: rgba(57,224,122,0.35); }
    .severity-opt.medium.active, .severity-opt.medium:hover { background: rgba(240,165,0,0.1);  border-color: rgba(240,165,0,0.35); }
    .severity-opt.high.active,   .severity-opt.high:hover   { background: rgba(232,92,58,0.1);  border-color: rgba(232,92,58,0.35); }

    .submit-btn { width: 100%; justify-content: center; border-radius: 12px; }

    /* ── FEATURES ── */
    .features-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
      margin-top: 56px;
    }

    .feature-card {
      background: var(--dark-2);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 20px;
      padding: 32px;
      transition: border-color 0.3s, transform 0.3s;
      position: relative;
      overflow: hidden;
    }

    .feature-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(57,224,122,0.3), transparent);
      opacity: 0;
      transition: opacity 0.3s;
    }

    .feature-card:hover { border-color: rgba(57,224,122,0.15); transform: translateY(-3px); }
    .feature-card:hover::before { opacity: 1; }

    .feature-icon {
      width: 52px; height: 52px;
      border-radius: 14px;
      background: rgba(57,224,122,0.08);
      border: 1px solid rgba(57,224,122,0.15);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.5rem;
      margin-bottom: 20px;
    }

    .feature-card h3 { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1.05rem; margin-bottom: 10px; }
    .feature-card p  { font-size: 0.87rem; color: var(--text-muted); line-height: 1.65; }

    /* ── CTA ── */
    .cta-section {
      padding: 80px 48px 120px;
      text-align: center;
      position: relative;
    }

    .cta-box { max-width: 640px; margin: 0 auto; }

    .cta-box h2 {
      font-family: 'Syne', sans-serif;
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 800;
      margin-bottom: 16px;
      line-height: 1.1;
    }

    .cta-box p { color: var(--text-muted); font-size: 1rem; margin-bottom: 36px; line-height: 1.6; }
    .cta-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }

    /* ── BUTTONS ── */
    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--green-neon);
      color: var(--dark);
      padding: 16px 32px;
      border-radius: 50px;
      font-weight: 600;
      font-size: 0.95rem;
      text-decoration: none;
      border: none; cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      font-family: 'DM Sans', sans-serif;
    }

    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 16px 40px rgba(57, 224, 122, 0.4); }

    .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: transparent;
      color: var(--text);
      padding: 16px 32px;
      border-radius: 50px;
      font-weight: 500;
      font-size: 0.95rem;
      text-decoration: none;
      border: 1px solid rgba(255,255,255,0.15);
      cursor: pointer;
      transition: border-color 0.2s, background 0.2s;
      font-family: 'DM Sans', sans-serif;
    }

    .btn-secondary:hover { border-color: rgba(255,255,255,0.35); background: rgba(255,255,255,0.05); }

    /* ── FOOTER ── */
    .footer {
      border-top: 1px solid rgba(255,255,255,0.06);
      padding: 40px 48px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.82rem;
      color: var(--text-muted);
    }

    .footer-logo { font-family: 'Syne', sans-serif; font-weight: 800; color: var(--white); font-size: 1rem; }
    .footer-logo span { color: var(--green-neon); }
    .footer-sub { font-size: 0.75rem; font-weight: 400; color: var(--text-muted); margin-left: 8px; }

    /* ── RESPONSIVE ── */
    @media (max-width: 1100px) { .hero-visual { display: none; } }

    @media (max-width: 900px) {
      .navbar { padding: 16px 24px; }
      .nav-links { display: none; }
      .hero { padding: 100px 24px 60px; }
      .section, .report-section, .cta-section { padding: 64px 24px; }
      .steps { grid-template-columns: 1fr; }
      .steps::before { display: none; }
      .report-grid { grid-template-columns: 1fr; }
      .features-grid { grid-template-columns: 1fr; }
      .hero-stats { gap: 28px; flex-wrap: wrap; }
      .footer { flex-direction: column; gap: 16px; text-align: center; }
    }
  `]
})
export class LandingComponent {
  constructor(private router: Router) {}

  goToReport() {
    this.router.navigate(['/login']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
