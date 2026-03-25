import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublicReportService } from '../../services/public-report.service';

@Component({
  selector: 'app-simple-landing-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="simple-form">
      <h2>📝 Report Waste Issue (Anonymous)</h2>
      <p>Help keep Angeles City clean by reporting waste issues in your area.</p>
      
      <form (ngSubmit)="onSubmit()" class="report-form">
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
          <label for="address">Address *</label>
          <input 
            type="text" 
            id="address"
            [(ngModel)]="report.address" 
            name="address" 
            placeholder="Street address or landmark"
            required
            class="form-input"
          >
        </div>

        <!-- Success/Error Messages -->
        <div *ngIf="successMessage" class="success-message">
          ✅ {{ successMessage }}
        </div>
        <div *ngIf="errorMessage" class="error-message">
          ⚠️ {{ errorMessage }}
        </div>

        <!-- Submit Button -->
        <button 
          type="submit" 
          class="submit-btn" 
          [disabled]="isSubmitting"
        >
          <span *ngIf="!isSubmitting">📝 Submit Anonymous Report</span>
          <span *ngIf="isSubmitting">⏳ Submitting...</span>
        </button>

        <!-- Test Button -->
        <button 
          type="button" 
          class="test-btn" 
          (click)="testAlert()"
        >
          🧪 Test Alert
        </button>
      </form>
    </div>
  `,
  styles: [`
    .simple-form {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      border: 1px solid #e0e0e0;
      max-width: 500px;
      margin: 0 auto;
    }
    
    h2 {
      text-align: center;
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }
    
    p {
      text-align: center;
      color: #6c757d;
      margin-bottom: 2rem;
    }
    
    .report-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .form-group label {
      font-weight: 600;
      color: #495057;
      margin-bottom: 0.25rem;
    }
    
    .form-input, .form-select, .form-textarea {
      padding: 0.75rem;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.2s;
      background: white;
      color: #2c3e50;
    }
    
    .form-input:focus, .form-select:focus, .form-textarea:focus {
      outline: none;
      border-color: #28a745;
      box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
    }
    
    .form-textarea {
      resize: vertical;
      min-height: 100px;
    }
    
    .success-message {
      background: #d4edda;
      color: #155724;
      padding: 1rem;
      border-radius: 8px;
      border: 1px solid #c3e6cb;
      font-weight: 600;
      margin-bottom: 1rem;
    }
    
    .error-message {
      background: #f8d7da;
      color: #721c24;
      padding: 1rem;
      border-radius: 8px;
      border: 1px solid #f5c6cb;
      font-weight: 600;
      margin-bottom: 1rem;
    }
    
    .submit-btn {
      background: #28a745;
      color: white;
      border: none;
      padding: 0.875rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .submit-btn:hover:not(:disabled) {
      background: #218838;
    }
    
    .submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .test-btn {
      background: #17a2b8;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.875rem;
      cursor: pointer;
      margin-top: 1rem;
    }
    
    .test-btn:hover {
      background: #138496;
    }
  `]
})
export class SimpleLandingReportComponent {
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

  constructor(private publicReportService: PublicReportService) {
    console.log('📝 Simple Landing Report Form Initialized!');
  }

  onSubmit(): void {
    if (!this.isFormValid()) {
      this.errorMessage = 'Please fill in all required fields (description needs 10+ characters).';
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
        console.log('✅ Report created:', response);
        this.isSubmitting = false;
        this.successMessage = 'Report submitted successfully! Thank you for helping keep Angeles City clean.';
        
        // Simple alert instead of popup
        alert('✅ Report Submitted Successfully!\\n\\nYour anonymous report has been sent to the City Hall sanitation team for review.');
        
        // Reset form after successful submission
        setTimeout(() => {
          this.resetForm();
          this.successMessage = '';
        }, 3000);
      },
      error: (error: any) => {
        console.error('❌ Report error:', error);
        this.isSubmitting = false;
        this.errorMessage = error?.error?.message || 'Failed to submit report. Please try again.';
      }
    });
  }

  testAlert(): void {
    console.log('🧪 Testing simple alert...');
    alert('🧪 Test Alert Working!\\n\\nThis confirms the component is functioning properly.');
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
    this.errorMessage = '';
    this.successMessage = '';
  }
}
