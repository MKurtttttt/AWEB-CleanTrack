import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublicReportService } from '../../services/public-report.service';
import { finalize, timeout } from 'rxjs/operators';

@Component({
  selector: 'app-landing-report-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="report-form-container">
      <div class="form-header">
        <h2>� Report Waste Issue (Anonymous)</h2>
        <p>Help keep Angeles City clean by reporting waste issues in your area. Your identity will be protected.</p>
      </div>

      <form (ngSubmit)="onSubmit()" class="report-form">
        <!-- Photo Upload Section -->
        <div class="form-section">
          <label class="section-title">Photo Evidence</label>
          <div class="photo-upload-area">
            <input 
              type="file" 
              accept="image/*" 
              (change)="onFileSelected($event)"
              #fileInput
              style="display: none;"
            >
            <div *ngIf="!imagePreview" class="upload-placeholder">
              <button type="button" class="upload-btn" (click)="fileInput.click()">
                📷 Choose Photo
              </button>
              <p>or drag & drop an image here</p>
              <small>JPG, PNG up to 10MB</small>
            </div>
            <div *ngIf="imagePreview" class="image-preview-container">
              <img [src]="imagePreview" alt="Waste issue photo">
              <button type="button" class="remove-image-btn" (click)="removeImage()">×</button>
            </div>
          </div>
        </div>

        <!-- Basic Information -->
        <div class="form-section">
          <label class="section-title">Report Details</label>
          
          <div class="form-group">
            <label for="title">Title *</label>
            <input 
              type="text" 
              id="title"
              [(ngModel)]="report.title" 
              name="title" 
              placeholder="Brief description of the waste issue"
              required
              class="form-input"
            >
          </div>

          <div class="form-group">
            <label for="category">Category *</label>
            <select id="category" [(ngModel)]="report.category" name="category" class="form-select" required>
              <option value="">Select category</option>
              <option value="GARBAGE_UNCOLLECTED">🗑️ Uncollected Garbage</option>
              <option value="ILLEGAL_DUMPING">⚠️ Illegal Dumping</option>
              <option value="WASTE_PILE_UP">📦 Waste Pile Up</option>
              <option value="RECYCLABLE_WASTE">♻️ Recyclable Waste</option>
              <option value="HAZARDOUS_WASTE">☣️ Hazardous Waste</option>
              <option value="OTHER">📋 Other</option>
            </select>
          </div>

          <div class="form-group">
            <label for="description">Description *</label>
            <textarea 
              id="description"
              [(ngModel)]="report.description" 
              name="description" 
              placeholder="Provide detailed information about the waste issue..."
              rows="4"
              required
              class="form-textarea"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="severity">Severity</label>
            <select id="severity" [(ngModel)]="report.severity" name="severity" class="form-select">
              <option value="LOW">🟢 Low - Minor issue</option>
              <option value="MEDIUM">🟡 Medium - Needs attention</option>
              <option value="HIGH">🟠 High - Urgent attention needed</option>
              <option value="CRITICAL">🔴 Critical - Immediate action required</option>
            </select>
          </div>
        </div>

        <!-- Location Information -->
        <div class="form-section">
          <label class="section-title">Location Details</label>
          
          <div class="form-row">
            <div class="form-group">
              <label for="barangay">Barangay *</label>
              <input 
                type="text" 
                id="barangay"
                [(ngModel)]="report.barangay" 
                name="barangay" 
                placeholder="e.g., Malabanias, Central Barangay"
                required
                class="form-input"
              >
            </div>
            <div class="form-group">
              <label for="houseNumber">House Number</label>
              <input 
                type="text" 
                id="houseNumber"
                [(ngModel)]="report.houseNumber" 
                name="houseNumber" 
                placeholder="123"
                class="form-input"
              >
            </div>
          </div>

          <div class="form-group">
            <label for="street">Street Address *</label>
            <input 
              type="text" 
              id="street"
              [(ngModel)]="report.street" 
              name="street" 
              placeholder="Street name or landmark"
              required
              class="form-input"
            >
          </div>
        </div>

        <!-- Submit Section -->
        <div class="form-section">
          <!-- Test Button -->
          <button 
            type="button" 
            class="test-popup-btn" 
            (click)="testPopup()"
            style="margin-bottom: 1rem; background: #3498db; color: white; padding: 0.5rem 1rem; border: none; border-radius: 8px; cursor: pointer;"
          >
            🧪 Test Popup
          </button>
          
          <div *ngIf="successMessage" class="success-message">
            ✅ {{ successMessage }}
          </div>
          <div *ngIf="submitError" class="error-message">
            ⚠️ {{ submitError }}
          </div>
          
          <button 
            type="submit" 
            class="submit-btn" 
            [disabled]="isSubmitting"
            [class.submitting]="isSubmitting"
          >
            <span *ngIf="!isSubmitting">� Submit Anonymous Report</span>
            <span *ngIf="isSubmitting">⏳ Submitting...</span>
          </button>
        </div>
      </form>
    </div>
    
    <!-- Success Popup Notification -->
    <div *ngIf="showSuccessPopup" class="popup-overlay" (click)="closePopup()">
      <div class="popup-modal" (click)="$event.stopPropagation()">
        <div class="popup-icon">✅</div>
        <h3>Report Submitted Successfully!</h3>
        <p>Your anonymous report has been sent to the City Hall sanitation team for review.</p>
        <button class="popup-button" (click)="closePopup()">Got it!</button>
      </div>
    </div>
  `,
  styles: [`
    .report-form-container {
      background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
      border-radius: 16px;
      padding: 2.5rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      border: 1px solid rgba(0,0,0,0.05);
      position: relative;
      overflow: hidden;
    }
    
    .report-form-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #27ae60 0%, #2ecc71 50%, #27ae60 100%);
    }
    
    .form-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .form-header h2 {
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
      font-size: 1.8rem;
      font-weight: 700;
    }
    
    .form-header p {
      margin: 0;
      color: #7f8c8d;
      font-size: 1rem;
    }
    
    .report-form {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    
    .form-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .section-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    
    .form-group label {
      font-size: 0.9rem;
      font-weight: 600;
      color: #555;
    }
    
    .form-input, .form-select, .form-textarea {
      width: 100%;
      padding: 0.875rem;
      border: 2px solid #e8ecef;
      border-radius: 10px;
      font-size: 0.95rem;
      transition: all 0.3s ease;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      color: #2c3e50;
    }
    
    .form-input:focus, .form-select:focus, .form-textarea:focus {
      outline: none;
      border-color: #27ae60;
      box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.1);
      transform: translateY(-1px);
    }
    
    .form-textarea {
      resize: vertical;
      min-height: 100px;
    }
    
    /* Photo Upload Styles */
    .photo-upload-area {
      position: relative;
    }
    
    .upload-placeholder {
      border: 2px dashed #27ae60;
      border-radius: 12px;
      padding: 2rem;
      text-align: center;
      background: rgba(39, 174, 96, 0.05);
      transition: all 0.3s ease;
    }
    
    .upload-placeholder:hover {
      background: rgba(39, 174, 96, 0.1);
      border-color: #2ecc71;
    }
    
    .upload-btn {
      background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      margin-bottom: 1rem;
      transition: transform 0.2s ease;
    }
    
    .upload-btn:hover {
      transform: translateY(-1px);
    }
    
    .image-preview-container {
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    
    .image-preview-container img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }
    
    .remove-image-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(231, 76, 60, 0.9);
      color: white;
      border: none;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
      transition: background 0.3s ease;
    }
    
    .remove-image-btn:hover {
      background: rgba(192, 57, 43, 1);
    }
    
    /* Submit Button */
    .submit-btn {
      background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 12px;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3);
    }
    
    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(39, 174, 96, 0.4);
    }
    
    .submit-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }
    
    .submit-btn.submitting {
      background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);
    }
    
    /* Messages */
    .success-message {
      background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
      color: #155724;
      padding: 1rem 1.5rem;
      border-radius: 12px;
      border: 1px solid #c3e6cb;
      font-weight: 600;
      animation: slideIn 0.3s ease;
    }
    
    .error-message {
      background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
      color: #721c24;
      padding: 1rem 1.5rem;
      border-radius: 12px;
      border: 1px solid #f5c6cb;
      font-weight: 600;
      animation: slideIn 0.3s ease;
    }
    
    /* Popup Notification Styles */
    .popup-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }
    
    .popup-modal {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      max-width: 400px;
      width: 90%;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.4);
      animation: popupSlideIn 0.3s ease;
    }
    
    .popup-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      animation: bounce 0.6s ease;
    }
    
    .popup-modal h3 {
      margin: 0 0 1rem 0;
      color: #27ae60;
      font-size: 1.3rem;
      font-weight: 700;
    }
    
    .popup-modal p {
      margin: 0 0 1.5rem 0;
      color: #6c757d;
      line-height: 1.5;
    }
    
    .popup-button {
      background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
      color: white;
      border: none;
      padding: 0.75rem 2rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s ease;
    }
    
    .popup-button:hover {
      transform: translateY(-1px);
    }
    
    @keyframes popupSlideIn {
      from {
        opacity: 0;
        transform: scale(0.7);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-10px);
      }
      60% {
        transform: translateY(-5px);
      }
    }
    
    @media (max-width: 768px) {
      .report-form-container {
        padding: 1.5rem;
        margin: 0 1rem;
      }
      
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .form-header h2 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class LandingReportFormComponent {
  report = {
    title: '',
    description: '',
    category: '',
    severity: 'MEDIUM',
    houseNumber: '',
    street: '',
    barangay: 'Malabanias'
  };
  
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isSubmitting = false;
  successMessage = '';
  submitError = '';
  showSuccessPopup = false;

  constructor(private publicReportService: PublicReportService) {
    console.log('🚮 Landing Report Form Component Initialized!');
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        this.submitError = 'Please select an image file';
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB
        this.submitError = 'Image size should be less than 10MB';
        return;
      }
      
      this.selectedFile = file;
      this.imagePreview = URL.createObjectURL(file);
      this.submitError = '';
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
  }

  onSubmit(): void {
    if (!this.isFormValid()) {
      this.submitError = 'Please fill in all required fields (description needs 10+ characters).';
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';
    this.successMessage = '';

    const formData = new FormData();
    formData.append('title', this.report.title);
    formData.append('description', this.report.description);
    formData.append('category', this.report.category);
    formData.append('priority', this.mapSeverityToPriority(this.report.severity));
    formData.append('location[latitude]', '15.1474');
    formData.append('location[longitude]', '120.5957');
    formData.append('location[address]', `${this.report.houseNumber} ${this.report.street}, ${this.report.barangay}`);
    formData.append('location[barangay]', this.report.barangay);
    formData.append('location[city]', 'Angeles City');

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.publicReportService.createPublicReport(formData).pipe(
      finalize(() => this.isSubmitting = false),
      timeout(30000) // 30 second timeout
    ).subscribe({
      next: (response: any) => {
        console.log('✅ Landing report created:', response);
        this.successMessage = '✅ Report submitted successfully! Thank you for helping keep Angeles City clean.';
        
        // Show popup notification
        this.showSuccessPopup = true;
        
        // Auto-close popup after 5 seconds
        setTimeout(() => {
          this.closePopup();
        }, 5000);
        
        // Reset form after successful submission
        setTimeout(() => {
          this.resetForm();
          this.successMessage = '';
        }, 1000);
      },
      error: (error: any) => {
        console.error('❌ Report error:', error);
        if (error?.status === 0) {
          this.submitError = 'Cannot reach server. Is the backend running?';
        } else if (error?.status === 400) {
          const errors = error?.error?.errors;
          if (errors && errors.length > 0) {
            this.submitError = errors.map((e: any) => e.msg).join('. ');
          } else {
            this.submitError = error?.error?.message || 'Please check all fields.';
          }
        } else {
          this.submitError = error?.error?.message || `Server error (${error?.status}). Try again.`;
        }
      }
    });
  }

  closePopup(): void {
    console.log('🔕 Closing popup...');
    this.showSuccessPopup = false;
  }

  testPopup(): void {
    console.log('🧪 Testing popup manually...');
    this.showSuccessPopup = true;
    console.log('🧪 Popup should be visible:', this.showSuccessPopup);
    
    // Auto-close after 3 seconds
    setTimeout(() => {
      this.closePopup();
    }, 3000);
  }

  private isFormValid(): boolean {
    return !!(this.report.title.trim().length >= 3 &&
           this.report.description.trim().length >= 10 &&
           this.report.category &&
           this.report.street.trim() &&
           this.report.barangay.trim());
  }

  private resetForm(): void {
    this.report = {
      title: '',
      description: '',
      category: '',
      severity: 'MEDIUM',
      houseNumber: '',
      street: '',
      barangay: 'Malabanias'
    };
    this.imagePreview = null;
    this.selectedFile = null;
    this.submitError = '';
    this.successMessage = '';
  }

  private mapSeverityToPriority(severity: string): string {
    switch (severity) {
      case 'LOW':
        return 'LOW';
      case 'MEDIUM':
        return 'MEDIUM';
      case 'HIGH':
        return 'HIGH';
      case 'CRITICAL':
        return 'URGENT';
      default:
        return 'MEDIUM';
    }
  }
}
