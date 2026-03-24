import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReportService } from '../../services/report';
import { finalize, timeout } from 'rxjs/operators';

@Component({
  selector: 'app-report-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="report-form-container">
      <div class="form-header">
        <h2>Report Waste Issue</h2>
        <p>Help keep Malabanias clean by reporting waste issues in your area.</p>
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
            <label for="category">Category</label>
            <select id="category" [(ngModel)]="report.category" name="category" class="form-select">
              <option value="">Select category</option>
              <option value="GARBAGE_UNCOLLECTED">Uncollected Garbage</option>
              <option value="ILLEGAL_DUMPING">Illegal Dumping</option>
              <option value="WASTE_PILE_UP">Waste Pile-Up</option>
              <option value="RECYCLABLE_WASTE">Recyclable Waste</option>
              <option value="HAZARDOUS_WASTE">Hazardous Waste</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <!-- Severity Picker -->
          <div class="form-group">
            <label>Severity Level *</label>
            <div class="severity-picker">
              <div class="severity-option" 
                   [class.selected]="report.severity === 'Low'" 
                   (click)="report.severity = 'Low'">
                <div class="severity-dot low"></div>
                <span>Low</span>
                <small>Minor issue, not urgent</small>
              </div>
              <div class="severity-option" 
                   [class.selected]="report.severity === 'Medium'" 
                   (click)="report.severity = 'Medium'">
                <div class="severity-dot medium"></div>
                <span>Medium</span>
                <small>Needs attention soon</small>
              </div>
              <div class="severity-option" 
                   [class.selected]="report.severity === 'High'" 
                   (click)="report.severity = 'High'">
                <div class="severity-dot high"></div>
                <span>High</span>
                <small>Urgent - immediate action needed</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Location Section -->
        <div class="form-section">
          <label class="section-title">Location</label>
          
          <div class="location-info">
            <div class="form-row">
              <div class="form-group">
                <label for="houseNumber">House Number *</label>
                <input 
                  type="text" 
                  id="houseNumber" 
                  [(ngModel)]="report.houseNumber" 
                  name="houseNumber" 
                  placeholder="e.g. 123"
                  required
                  class="form-input"
                >
              </div>
              
              <div class="form-group">
                <label for="street">Street Address *</label>
                <input 
                  type="text" 
                  id="street" 
                  [(ngModel)]="report.street" 
                  name="street" 
                  placeholder="e.g. Rizal Street"
                  required
                  class="form-input"
                >
              </div>
            </div>
            
            <div class="barangay-info">
              <strong>Barangay:</strong> Malabanias
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="form-actions">
          <div *ngIf="successMessage" class="submit-success">
            <div class="success-icon">✅</div>
            <div>{{ successMessage }}</div>
          </div>
          <div *ngIf="submitError" class="submit-error">
            <div class="error-icon">⚠️</div>
            <div>{{ submitError }}</div>
          </div>
          <button 
            type="submit" 
            class="submit-btn" 
            [disabled]="isSubmitting || !isFormValid()"
            [class.submitting]="isSubmitting"
          >
            <span *ngIf="!isSubmitting" class="submit-content">
              <span class="submit-icon">🚮</span>
              <span>Submit Report</span>
            </span>
            <span *ngIf="isSubmitting" class="submitting-content">
              <div class="spinner"></div>
              <span>Submitting...</span>
            </span>
          </button>
        </div>
      </form>

      <!-- Success Modal -->
      <div class="modal-overlay" [class.open]="showSuccessModal" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-icon">✅</div>
          <h3>Report Submitted Successfully!</h3>
          <p>Your waste report has been successfully submitted and will be reviewed by our team.</p>
          <div class="modal-id">Reference ID: #{{ reportId }}</div>
          <div class="modal-details">
            <p><strong>What happens next?</strong></p>
            <ul>
              <li>Our team will review your report within 24 hours</li>
              <li>You'll receive updates on the status</li>
              <li>Barangay officials have been notified</li>
            </ul>
          </div>
          <div class="modal-actions">
            <button class="modal-btn secondary" (click)="closeModal()">View My Reports</button>
            <button class="modal-btn primary" (click)="showSuccessModal = false; resetForm()">Submit Another</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .report-form-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      font-family: 'DM Sans', sans-serif;
    }

    .form-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .form-header h2 {
      font-family: 'Syne', sans-serif;
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--white);
      margin-bottom: 16px;
    }

    .form-header p {
      color: var(--text-muted);
      font-size: 1.1rem;
      margin: 0;
    }

    .form-section {
      margin-bottom: 40px;
    }

    .section-title {
      display: block;
      font-family: 'Syne', sans-serif;
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--white);
      margin-bottom: 20px;
    }

    .form-group {
      margin-bottom: 24px;
    }

    .form-group label {
      display: block;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-muted);
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .form-input, .form-select, .form-textarea {
      width: 100%;
      padding: 16px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      color: var(--text);
      font-family: 'DM Sans', sans-serif;
      font-size: 1rem;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .form-input:focus, .form-select:focus, .form-textarea:focus {
      border-color: rgba(57,224,122,0.4);
      box-shadow: 0 0 0 3px rgba(57,224,122,0.08);
      background: rgba(255,255,255,0.06);
    }

    .form-textarea {
      resize: vertical;
      min-height: 120px;
    }

    /* Photo Upload */
    .photo-upload-area {
      border: 2px dashed rgba(255,255,255,0.2);
      border-radius: 16px;
      padding: 20px;
      text-align: center;
      transition: border-color 0.3s, background 0.3s;
      position: relative;
      min-height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .photo-upload-area:hover {
      border-color: var(--green-neon);
      background: rgba(57,224,122,0.02);
    }

    .upload-placeholder {
      pointer-events: none;
    }

    .upload-btn {
      background: var(--green-neon);
      color: var(--dark);
      border: none;
      border-radius: 12px;
      padding: 16px 32px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      font-family: 'DM Sans', sans-serif;
      margin-bottom: 16px;
      pointer-events: all;
    }

    .upload-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 16px 40px rgba(57,224,122,0.4);
    }

    .upload-placeholder p {
      color: var(--text);
      font-size: 1.1rem;
      margin: 0 0 8px 0;
    }

    .upload-placeholder small {
      color: var(--text-muted);
    }

    .image-preview-container {
      position: relative;
      width: 100%;
      max-width: 100%;
      height: 320px;
      border-radius: 12px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.2);
    }

    .image-preview-container img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 12px;
      display: block;
    }

    .remove-image-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      background: var(--danger);
      color: white;
      border: none;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      cursor: pointer;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Severity Picker */
    .severity-picker {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .severity-option {
      border: 2px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
      background: rgba(255,255,255,0.02);
    }

    .severity-option:hover {
      border-color: rgba(255,255,255,0.3);
      background: rgba(255,255,255,0.05);
    }

    .severity-option.selected {
      border-color: var(--green-neon);
      background: rgba(57,224,122,0.08);
    }

    .severity-dot {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      margin: 0 auto 12px;
    }

    .severity-dot.low { background: #f0a500; }
    .severity-dot.medium { background: #ff6b35; }
    .severity-dot.high { background: #e85c3a; }

    .severity-option span {
      display: block;
      font-weight: 600;
      color: var(--white);
      margin-bottom: 4px;
    }

    .severity-option small {
      color: var(--text-muted);
      font-size: 0.8rem;
    }

    /* Location */
    .location-info {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      padding: 20px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .barangay-info {
      margin-top: 16px;
      padding: 12px;
      background: rgba(57,224,122,0.08);
      border: 1px solid rgba(57,224,122,0.15);
      border-radius: 8px;
      text-align: center;
    }

    .barangay-info strong {
      color: var(--green-neon);
      font-weight: 600;
    }

    .location-display {
      margin-bottom: 16px;
    }

    .location-display strong {
      color: var(--white);
    }

    .location-display p {
      color: var(--text);
      margin: 8px 0;
    }

    .location-display small {
      color: var(--text-muted);
    }

    .location-btn {
      background: var(--green-neon);
      color: var(--dark);
      border: none;
      border-radius: 8px;
      padding: 12px 24px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .location-btn:hover:not(:disabled) {
      transform: translateY(-2px);
    }

    .location-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    /* Submit Button */
    .form-actions {
      text-align: center;
      margin-top: 40px;
    }

    .submit-error {
      background: rgba(232, 92, 58, 0.12);
      border: 1px solid rgba(232, 92, 58, 0.25);
      color: var(--danger);
      border-radius: 10px;
      padding: 12px 14px;
      margin-bottom: 16px;
      font-size: 0.9rem;
      text-align: left;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .submit-success {
      background: rgba(57, 224, 122, 0.12);
      border: 1px solid rgba(57, 224, 122, 0.3);
      color: var(--green-neon);
      border-radius: 10px;
      padding: 12px 14px;
      margin-bottom: 16px;
      font-size: 0.9rem;
      text-align: left;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .error-icon, .success-icon {
      font-size: 1.2rem;
      flex-shrink: 0;
    }

    .submit-btn {
      background: var(--green-neon);
      color: var(--dark);
      border: none;
      border-radius: 12px;
      padding: 18px 48px;
      font-size: 1.1rem;
      font-weight: 700;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      font-family: 'DM Sans', sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      min-height: 56px;
    }

    .submit-btn.submitting {
      background: var(--green-neon);
      opacity: 0.8;
    }

    .submit-content, .submitting-content {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .submit-icon {
      font-size: 1.2rem;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(0,0,0,0.3);
      border-top: 2px solid #fff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 16px 40px rgba(57,224,122,0.4);
    }

    .submit-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s;
    }

    .modal-overlay.open {
      opacity: 1;
      visibility: visible;
    }

    .modal {
      background: var(--dark-2);
      border: 1px solid rgba(57,224,122,0.2);
      border-radius: 24px;
      padding: 40px;
      max-width: 520px;
      width: 90%;
      text-align: center;
    }

    .modal-icon {
      font-size: 3rem;
      margin-bottom: 16px;
    }

    .modal h3 {
      font-family: 'Syne', sans-serif;
      font-weight: 800;
      font-size: 1.5rem;
      margin-bottom: 10px;
      color: var(--green-neon);
    }

    .modal p {
      color: var(--text-muted);
      font-size: 0.9rem;
      line-height: 1.6;
      margin-bottom: 24px;
    }

    .modal-id {
      display: inline-block;
      background: rgba(57,224,122,0.08);
      color: var(--green-neon);
      font-family: 'Syne', sans-serif;
      font-weight: 700;
      font-size: 1.1rem;
      padding: 10px 24px;
      border-radius: 10px;
      letter-spacing: 0.1em;
      margin-bottom: 24px;
    }

    .modal-details {
      background: rgba(255,255,255,0.04);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 24px;
      text-align: left;
    }

    .modal-details p {
      margin-bottom: 12px;
      color: var(--white);
    }

    .modal-details ul {
      margin: 0;
      padding-left: 20px;
      color: var(--text-muted);
    }

    .modal-details li {
      margin-bottom: 8px;
    }

    .modal-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
    }

    .modal-btn {
      border: none;
      border-radius: 8px;
      padding: 12px 24px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .modal-btn.primary {
      background: var(--green-neon);
      color: var(--dark);
    }

    .modal-btn.secondary {
      background: rgba(255,255,255,0.1);
      color: var(--white);
      border: 1px solid rgba(255,255,255,0.2);
    }

    .modal-btn:hover {
      transform: translateY(-2px);
    }

    @media (max-width: 768px) {
      .severity-picker {
        grid-template-columns: 1fr;
      }
      
      .form-container {
        padding: 20px;
      }

      .photo-upload-area {
        min-height: 180px;
      }

      .image-preview-container {
        height: 220px;
      }
    }
  `]
})
export class ReportForm {
  report = {
    title: '',
    description: '',
    category: '',
    severity: 'Medium',
    houseNumber: '',
    street: '',
    barangay: 'Central Barangay'
  };

  isSubmitting = false;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isDragOver = false;
  showSuccessModal = false;
  reportId = '';
  fileInput: HTMLInputElement | undefined;
  submitError = '';
  successMessage = '';

  constructor(
    private reportService: ReportService,
    private router: Router
  ) {
    if (typeof localStorage !== 'undefined') {
      const userStr = localStorage.getItem('current_user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user?.barangay) {
            this.report.barangay = user.barangay;
          }
        } catch {
          // Keep default barangay when stored user data is invalid.
        }
      }
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      console.log('File selected:', file.name);
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
        console.log('Image preview loaded');
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    console.log('Removing image');
    this.selectedFile = null;
    this.imagePreview = null;
  }

  isFormValid(): boolean {
    return !!(
      this.report.title &&
      this.report.description &&
      this.report.category &&
      this.report.severity &&
      this.report.houseNumber &&
      this.report.street
    );
  }

  onSubmit(): void {
    if (!this.isFormValid()) return;

    this.isSubmitting = true;
    this.submitError = '';
    this.successMessage = '';

    // Create form data for file upload
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

    this.reportService.createReport(formData).pipe(
      timeout(15000),
      finalize(() => {
        this.isSubmitting = false;
      })
    ).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        this.reportId = response._id || response.id || Date.now().toString();
        this.successMessage = `Report submitted successfully! Reference ID: #${this.reportId}`;
        this.showSuccessModal = true;
        
        // Show success message for 3 seconds, then navigate
        setTimeout(() => {
          this.showSuccessModal = false;
          this.resetForm();
          this.router.navigate(['/resident/reports']);
        }, 3000);
      },
      error: (error) => {
        console.error('Report submission error:', error);
        this.submitError = error?.error?.message || error?.message || 'Error submitting report. Please try again.';
        // Clear error after 5 seconds
        setTimeout(() => {
          this.submitError = '';
        }, 5000);
      }
    });
  }

  private mapSeverityToPriority(severity: string): string {
    if (severity === 'High') return 'URGENT';
    if (severity === 'Medium') return 'HIGH';
    return 'MEDIUM';
  }

  resetForm(): void {
    this.report = {
      title: '',
      description: '',
      category: '',
      severity: 'Medium',
      houseNumber: '',
      street: '',
      barangay: this.report.barangay || 'Central Barangay'
    };
    this.selectedFile = null;
    this.imagePreview = null;
    this.submitError = '';
    this.successMessage = '';
  }

  closeModal(): void {
    this.showSuccessModal = false;
    this.resetForm();
    this.router.navigate(['/resident/reports']);
  }
}
