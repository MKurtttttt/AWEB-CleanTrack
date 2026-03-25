import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from '../notifications/notifications.component';

@Component({
  selector: 'app-notification-demo',
  standalone: true,
  imports: [CommonModule, NotificationsComponent],
  template: `
    <div class="demo-container">
      <header class="demo-header">
        <h1>CleanTrack Notification System Demo</h1>
        <div class="header-right">
          <app-notifications></app-notifications>
          <div class="user-info">
            <span class="user-name">Admin User</span>
            <span class="user-role">Administrator</span>
          </div>
        </div>
      </header>

      <main class="demo-main">
        <div class="demo-section">
          <h2>🔔 Notification Features</h2>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">📝</div>
              <h3>New Report Notifications</h3>
              <p>Get notified when residents submit new waste reports in your barangay.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">👤</div>
              <h3>Assignment Alerts</h3>
              <p>Barangay officials receive notifications when reports are assigned to them.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🔄</div>
              <h3>Status Updates</h3>
              <p>Track report progress with real-time status update notifications.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">✅</div>
              <h3>Resolution Alerts</h3>
              <p>Get notified when waste reports are successfully resolved.</p>
            </div>
          </div>
        </div>

        <div class="demo-section">
          <h2>📊 Current System Status</h2>
          <div class="status-grid">
            <div class="status-card">
              <div class="status-number">22</div>
              <div class="status-label">Total Notifications</div>
            </div>
            <div class="status-card">
              <div class="status-number">1</div>
              <div class="status-label">Admin Users</div>
            </div>
            <div class="status-card">
              <div class="status-number">11</div>
              <div class="status-label">Total Reports</div>
            </div>
            <div class="status-card">
              <div class="status-number">✅</div>
              <div class="status-label">System Active</div>
            </div>
          </div>
        </div>

        <div class="demo-section">
          <h2>🎯 How to Test</h2>
          <div class="test-steps">
            <div class="step">
              <div class="step-number">1</div>
              <div class="step-content">
                <h4>Create a New Report</h4>
                <p>Submit a waste report as a resident to trigger notifications.</p>
              </div>
            </div>
            <div class="step">
              <div class="step-number">2</div>
              <div class="step-content">
                <h4>Check Notification Bell</h4>
                <p>Look for the red badge on the notification bell icon.</p>
              </div>
            </div>
            <div class="step">
              <div class="step-number">3</div>
              <div class="step-content">
                <h4>Click to View</h4>
                <p>Click the bell to see all notifications and manage them.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .demo-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
      font-family: Arial, sans-serif;
    }

    .demo-header {
      background: white;
      padding: 1rem 2rem;
      border-bottom: 1px solid #e9ecef;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .demo-header h1 {
      margin: 0;
      color: #2c3e50;
      font-size: 1.5rem;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .user-info {
      text-align: right;
    }

    .user-name {
      display: block;
      font-weight: 600;
      color: #2c3e50;
    }

    .user-role {
      display: block;
      font-size: 0.875rem;
      color: #6c757d;
    }

    .demo-main {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .demo-section {
      margin-bottom: 3rem;
    }

    .demo-section h2 {
      color: #2c3e50;
      margin-bottom: 1.5rem;
      font-size: 1.8rem;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .feature-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      text-align: center;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .feature-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 15px rgba(0,0,0,0.15);
    }

    .feature-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .feature-card h3 {
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
      font-size: 1.1rem;
    }

    .feature-card p {
      margin: 0;
      color: #6c757d;
      font-size: 0.9rem;
      line-height: 1.4;
    }

    .status-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .status-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      text-align: center;
    }

    .status-number {
      font-size: 2.5rem;
      font-weight: bold;
      color: #3498db;
      margin-bottom: 0.5rem;
    }

    .status-label {
      color: #6c757d;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .test-steps {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .step {
      display: flex;
      gap: 1rem;
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .step-number {
      width: 40px;
      height: 40px;
      background: #3498db;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      flex-shrink: 0;
    }

    .step-content h4 {
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
      font-size: 1.1rem;
    }

    .step-content p {
      margin: 0;
      color: #6c757d;
      font-size: 0.9rem;
      line-height: 1.4;
    }

    @media (max-width: 768px) {
      .demo-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .header-right {
        flex-direction: column;
        gap: 1rem;
      }

      .demo-main {
        padding: 1rem;
      }
    }
  `]
})
export class NotificationDemoComponent {
  constructor() {
    console.log('Notification Demo Component Initialized!');
  }
}
