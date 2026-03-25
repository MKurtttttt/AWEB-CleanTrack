import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-resident-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="resident-dashboard">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-content">
          <div class="logo">
            <span class="logo-icon">🌿</span>
            <span class="logo-text">CleanTrack</span>
          </div>
          <div class="user-menu">
            <span class="welcome-text">Welcome, {{ currentUser?.name }}!</span>
            <button class="logout-btn" (click)="logout()">Logout</button>
          </div>
        </div>
      </header>

      <!-- Main Content - Just the Report Form -->
      <main class="dashboard-main">
        <div class="report-form-container">
          <div class="form-header">
            <h2>Report Waste Management Issue</h2>
            <p>Help keep your community clean by reporting waste management issues</p>
          </div>
          
          <div class="report-form">
            <div class="form-grid">
              <div class="form-group">
                <label for="title">Report Title *</label>
                <input 
                  type="text" 
                  id="title" 
                  class="form-control" 
                  placeholder="Brief description of the issue"
                >
              </div>
              
              <div class="form-group">
                <label for="category">Category *</label>
                <select id="category" class="form-control">
                  <option value="">Select category</option>
                  <option value="GARBAGE_UNCOLLECTED">Garbage Uncollected</option>
                  <option value="ILLEGAL_DUMPING">Illegal Dumping</option>
                  <option value="WASTE_PILE_UP">Waste Pile Up</option>
                  <option value="RECYCLABLE_WASTE">Recyclable Waste</option>
                  <option value="HAZARDOUS_WASTE">Hazardous Waste</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              
              <div class="form-group full-width">
                <label for="description">Description *</label>
                <textarea 
                  id="description" 
                  class="form-control" 
                  rows="4" 
                  placeholder="Detailed description of the waste issue"
                ></textarea>
              </div>
              
              <div class="form-group">
                <label for="address">Address *</label>
                <input 
                  type="text" 
                  id="address" 
                  class="form-control" 
                  placeholder="Exact address or location"
                >
              </div>
              
              <div class="form-group">
                <label for="barangay">Barangay *</label>
                <input 
                  type="text" 
                  id="barangay" 
                  class="form-control" 
                  [value]="currentUser?.barangay || ''"
                  readonly
                >
              </div>
              
              <div class="form-group">
                <label for="priority">Priority</label>
                <select id="priority" class="form-control">
                  <option value="LOW">Low</option>
                  <option value="MEDIUM" selected>Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
              
              <div class="form-group full-width">
                <label for="photo">Photo Evidence</label>
                <div class="photo-upload">
                  <input 
                    type="file" 
                    id="photo" 
                    class="form-control" 
                    accept="image/*"
                    (change)="onPhotoSelect($event)"
                  >
                  <div class="photo-preview" *ngIf="photoPreview">
                    <img [src]="photoPreview" alt="Preview">
                    <button type="button" class="remove-photo" (click)="removePhoto()">×</button>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn-cancel" (click)="resetForm()">Clear</button>
              <button type="button" class="btn-submit" (click)="submitReport()">Submit Report</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .resident-dashboard {
      min-height: 100vh;
      background: #f8f9fa;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .dashboard-header {
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .logo-icon {
      font-size: 1.5rem;
    }

    .logo-text {
      font-size: 1.25rem;
      font-weight: 600;
      color: #2c3e50;
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .welcome-text {
      color: #666;
      font-weight: 500;
    }

    .logout-btn {
      background: #dc3545;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;
    }

    .logout-btn:hover {
      background: #c82333;
    }

    .dashboard-main {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }

    .report-form-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .form-header {
      background: linear-gradient(135deg, #28a745, #20c997);
      color: white;
      padding: 2rem;
      text-align: center;
    }

    .form-header h2 {
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
    }

    .form-header p {
      margin: 0;
      opacity: 0.9;
    }

    .report-form {
      padding: 2rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    .form-group label {
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
    }

    .form-control {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    .form-control:focus {
      outline: none;
      border-color: #28a745;
      box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.2);
    }

    .form-control[readonly] {
      background: #f8f9fa;
      color: #666;
    }

    textarea.form-control {
      resize: vertical;
      min-height: 100px;
    }

    .photo-upload {
      position: relative;
    }

    .photo-preview {
      margin-top: 1rem;
      position: relative;
      display: inline-block;
    }

    .photo-preview img {
      max-width: 200px;
      max-height: 200px;
      border-radius: 4px;
      border: 1px solid #ddd;
    }

    .remove-photo {
      position: absolute;
      top: -8px;
      right: -8px;
      background: #dc3545;
      color: white;
      border: none;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      cursor: pointer;
      font-size: 16px;
      line-height: 1;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #eee;
    }

    .btn-cancel, .btn-submit {
      padding: 0.75rem 2rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
      transition: all 0.2s;
    }

    .btn-cancel {
      background: #6c757d;
      color: white;
    }

    .btn-cancel:hover {
      background: #5a6268;
    }

    .btn-submit {
      background: #28a745;
      color: white;
    }

    .btn-submit:hover {
      background: #218838;
      transform: translateY(-1px);
    }

    @media (max-width: 768px) {
      .dashboard-main {
        padding: 1rem;
      }

      .form-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .header-content {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class ResidentDashboardComponent implements OnInit {
  currentUser: any;
  photoPreview: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
  }

  onPhotoSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.photoPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removePhoto() {
    this.photoPreview = null;
    const photoInput = document.getElementById('photo') as HTMLInputElement;
    if (photoInput) {
      photoInput.value = '';
    }
  }

  resetForm() {
    const form = document.querySelector('.report-form') as HTMLFormElement;
    if (form) {
      form.reset();
    }
    this.removePhoto();
  }

  submitReport() {
    // Get form values
    const title = (document.getElementById('title') as HTMLInputElement)?.value;
    const category = (document.getElementById('category') as HTMLSelectElement)?.value;
    const description = (document.getElementById('description') as HTMLTextAreaElement)?.value;
    const address = (document.getElementById('address') as HTMLInputElement)?.value;
    const barangay = (document.getElementById('barangay') as HTMLInputElement)?.value;
    const priority = (document.getElementById('priority') as HTMLSelectElement)?.value;

    // Basic validation
    if (!title || !category || !description || !address) {
      alert('Please fill in all required fields');
      return;
    }

    // Create report object
    const reportData = {
      title,
      category,
      description,
      location: {
        address,
        barangay,
        city: 'Angeles City',
        latitude: 0, // You might want to add geolocation
        longitude: 0
      },
      priority,
      imageUrl: this.photoPreview || undefined
    };

    console.log('Report data:', reportData);
    alert('Report submitted successfully! (This is a demo - actual submission would be implemented)');
    this.resetForm();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
