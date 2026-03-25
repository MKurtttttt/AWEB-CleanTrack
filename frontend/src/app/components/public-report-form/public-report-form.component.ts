import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublicReportService } from '../../services/public-report.service';

@Component({
  selector: 'app-public-report-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="public-report-form">
      <h3>🚮 Quick Report (Anonymous)</h3>
      <p class="form-subtitle">Report waste issues without logging in - your identity will be protected</p>
      
      <form (ngSubmit)="onSubmit()" class="quick-form">
        <div class="form-row">
          <div class="form-group">
            <label for="title">Title *</label>
            <input 
              type="text" 
              id="title"
              [(ngModel)]="report.title" 
              name="title" 
              placeholder="e.g., Trash overflowing on Main Street"
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
              <option value="CONTAMINATED_AREA">☣️ Contaminated Area</option>
            </select>
          </div>
        </div>
        
        <div class="form-group">
          <label for="description">Description *</label>
          <textarea 
            id="description"
            [(ngModel)]="report.description" 
            name="description" 
            placeholder="Please provide detailed information about the waste issue, including location details and any specific concerns..."
            rows="4"
            required
            class="form-textarea"
          ></textarea>
        </div>
        
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
            <label for="address">Address/Landmark *</label>
            <input 
              type="text" 
              id="address"
              [(ngModel)]="report.address" 
              name="address" 
              placeholder="e.g., Near City Hall, Mabini Street corner"
              required
              class="form-input"
            >
          </div>
        </div>
        
        <div class="form-actions">
          <div *ngIf="successMessage" class="success-message">
            {{ successMessage }}
          </div>
          <div *ngIf="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
          <button 
            type="submit" 
            class="submit-btn" 
            [disabled]="isSubmitting"
            [class.submitting]="isSubmitting"
          >
            <span *ngIf="!isSubmitting">🚮 Submit Anonymous Report</span>
            <span *ngIf="isSubmitting">⏳ Submitting...</span>
          </button>
          
          <!-- Test button for popup -->
          <button 
            type="button" 
            class="test-btn" 
            (click)="testPopup()"
            style="margin-top: 1rem; background: #3498db; color: white; padding: 0.5rem 1rem; border: none; border-radius: 8px; cursor: pointer;"
          >
            🧪 Test Popup
          </button>
        </div>
      </form>
    </div>
    
    <!-- Success Popup Notification -->
    <div *ngIf="showSuccessPopup" class="popup-notification success-popup show" 
         (click)="closePopup()">
      <div class="popup-content" (click)="$event.stopPropagation()">
        <div class="popup-icon">✅</div>
        <h4>Report Submitted Successfully!</h4>
        <p>Your anonymous report has been sent to the City Hall sanitation team for review.</p>
        <button class="popup-close-btn" (click)="closePopup()">Got it!</button>
      </div>
    </div>
  `,
  styles: [`
    .public-report-form {
      background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
      border-radius: 16px;
      padding: 2.5rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      border: 1px solid rgba(0,0,0,0.05);
      position: relative;
      overflow: hidden;
    }
    
    .public-report-form::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #27ae60 0%, #2ecc71 50%, #27ae60 100%);
    }
    
    h3 {
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
      font-size: 1.5rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .form-subtitle {
      margin: 0 0 2rem 0;
      color: #7f8c8d;
      font-size: 0.95rem;
      font-weight: 500;
    }
    
    .quick-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .form-group label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #555;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .form-input, .form-select, .form-textarea {
      width: 100%;
      padding: 1rem;
      border: 2px solid #e8ecef;
      border-radius: 12px;
      font-size: 0.95rem;
      transition: all 0.3s ease;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      color: #2c3e50; /* Fix text color */
    }
    
    .form-select option {
      color: #2c3e50; /* Fix dropdown options color */
      background: white;
    }
    
    .form-input:focus, .form-select:focus, .form-textarea:focus {
      outline: none;
      border-color: #27ae60;
      box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.1);
      transform: translateY(-1px);
    }
    
    .form-input::placeholder, .form-textarea::placeholder {
      color: #6c757d; /* Fix placeholder color */
    }
    
    .form-textarea {
      resize: vertical;
      min-height: 100px;
    }
    
    .form-actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
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
      position: relative;
      overflow: hidden;
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
    
    @media (max-width: 768px) {
      .public-report-form {
        padding: 1.5rem;
        margin: 0 1rem;
      }
      
      .form-row {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      
      h3 {
        font-size: 1.3rem;
      }
      
      .submit-btn {
        padding: 0.875rem 1.5rem;
        font-size: 0.9rem;
      }
    }
    
    /* Add some visual enhancements */
    .form-group:hover .form-input,
    .form-group:hover .form-select,
    .form-group:hover .form-textarea {
      border-color: #bdc3c7;
    }
    
    /* Success animation */
    .success-message {
      position: relative;
    }
    
    .success-message::before {
      content: '✓';
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.2rem;
      color: #28a745;
      font-weight: bold;
    }
    
    .success-message {
      padding-left: 2.5rem;
    }
    
    /* Error animation */
    .error-message::before {
      content: '⚠';
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.2rem;
      color: #dc3545;
    }
    
    .error-message {
      padding-left: 2.5rem;
    }
    
    /* Popup Notification Styles */
    .popup-notification {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }
    
    .popup-notification.show {
      opacity: 1;
      visibility: visible;
    }
    
    .popup-content {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      max-width: 400px;
      width: 90%;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      transform: scale(0.8);
      transition: transform 0.3s ease;
      position: relative;
    }
    
    .popup-notification.show .popup-content {
      transform: scale(1);
    }
    
    .popup-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      animation: bounce 0.6s ease;
    }
    
    .popup-content h4 {
      margin: 0 0 1rem 0;
      color: #27ae60;
      font-size: 1.3rem;
      font-weight: 700;
    }
    
    .popup-content p {
      margin: 0 0 1.5rem 0;
      color: #6c757d;
      line-height: 1.5;
    }
    
    .popup-close-btn {
      background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
      color: white;
      border: none;
      padding: 0.75rem 2rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s ease;
    }
    
    .popup-close-btn:hover {
      transform: translateY(-1px);
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
  `]
})
export class PublicReportFormComponent {
  report = {
    title: '',
    description: '',
    category: '',
    barangay: '',
    address: ''
  };
  
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';
  showSuccessPopup = false;

  constructor(private publicReportService: PublicReportService) {}

  onSubmit(): void {
    if (!this.isFormValid()) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = new FormData();
    formData.append('title', this.report.title);
    formData.append('description', this.report.description);
    formData.append('category', this.report.category);
    formData.append('priority', 'MEDIUM');
    formData.append('location[latitude]', '15.1474');
    formData.append('location[longitude]', '120.5957');
    formData.append('location[address]', this.report.address);
    formData.append('location[barangay]', this.report.barangay);
    formData.append('location[city]', 'Angeles City');

    this.publicReportService.createPublicReport(formData).subscribe({
      next: (response: any) => {
        console.log('✅ Public report created:', response);
        this.isSubmitting = false;
        this.successMessage = '✅ Report submitted successfully! Thank you for helping keep Malabanias clean.';
        
        // Show popup notification
        console.log('🔔 Showing popup...');
        this.showSuccessPopup = true;
        console.log('🔔 Popup should be visible:', this.showSuccessPopup);
        
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
        console.error('Report error:', error);
        this.isSubmitting = false;
        this.errorMessage = error?.error?.message || 'Failed to submit report. Please try again.';
      }
    });
  }

  closePopup(): void {
    console.log('🔕 Closing popup...');
    this.showSuccessPopup = false;
    console.log('🔕 Popup hidden:', this.showSuccessPopup);
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
           this.report.barangay.trim() &&
           this.report.address.trim());
  }

  private resetForm(): void {
    this.report = {
      title: '',
      description: '',
      category: '',
      barangay: '',
      address: ''
    };
  }
}
