import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

import { EnquiryService } from '../../services/enquiry.service';
import { CreateEnquiryRequest } from '../../models/enquiry.model';

@Component({
  selector: 'app-enquiry-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatToolbarModule
  ],
  template: `
    <div class="form-container">
      <mat-toolbar color="primary" class="form-header">
        <mat-icon>contact_mail</mat-icon>
        <span>New Enquiry</span>
      </mat-toolbar>

      <mat-card class="form-card">
        <mat-card-content>
          <form [formGroup]="enquiryForm" (ngSubmit)="onSubmit()" class="enquiry-form">
            <div class="form-row">
              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Full Name</mat-label>
                <input matInput formControlName="name" placeholder="Enter your full name">
                <mat-icon matSuffix>person</mat-icon>
                @if (enquiryForm.get('name')?.invalid && enquiryForm.get('name')?.touched) {
                  <mat-error>Name is required</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Email</mat-label>
                <input matInput type="email" formControlName="email" placeholder="Enter your email">
                <mat-icon matSuffix>email</mat-icon>
                @if (enquiryForm.get('email')?.invalid && enquiryForm.get('email')?.touched) {
                  <mat-error>Valid email is required</mat-error>
                }
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Phone Number</mat-label>
                <input matInput formControlName="phone" placeholder="Enter your phone number">
                <mat-icon matSuffix>phone</mat-icon>
                @if (enquiryForm.get('phone')?.invalid && enquiryForm.get('phone')?.touched) {
                  <mat-error>Phone number is required</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Subject</mat-label>
                <input matInput formControlName="subject" placeholder="Enter enquiry subject">
                <mat-icon matSuffix>subject</mat-icon>
                @if (enquiryForm.get('subject')?.invalid && enquiryForm.get('subject')?.touched) {
                  <mat-error>Subject is required</mat-error>
                }
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="form-field full-width">
              <mat-label>Message</mat-label>
              <textarea 
                matInput 
                formControlName="message" 
                placeholder="Describe your enquiry in detail..."
                rows="6"
                maxlength="1000">
              </textarea>
              <mat-icon matSuffix>message</mat-icon>
              <mat-hint align="end">{{enquiryForm.get('message')?.value?.length || 0}}/1000</mat-hint>
              @if (enquiryForm.get('message')?.invalid && enquiryForm.get('message')?.touched) {
                <mat-error>Message is required</mat-error>
              }
            </mat-form-field>

            <div class="form-actions">
              <button 
                mat-raised-button 
                color="warn" 
                type="button" 
                (click)="onCancel()"
                [disabled]="isSubmitting()">
                Cancel
              </button>
              <button 
                mat-raised-button 
                color="primary" 
                type="submit"
                [disabled]="enquiryForm.invalid || isSubmitting()">
                @if (isSubmitting()) {
                  <mat-spinner diameter="20"></mat-spinner>
                  <span>Submitting...</span>
                } @else {
                  <mat-icon>send</mat-icon>
                  <span>Submit Enquiry</span>
                }
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .form-header {
      margin-bottom: 20px;
      border-radius: 8px 8px 0 0;
    }

    .form-header mat-icon {
      margin-right: 10px;
    }

    .form-card {
      border-radius: 0 0 8px 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .enquiry-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .form-field {
      width: 100%;
    }

    .full-width {
      grid-column: 1 / -1;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 20px;
    }

    .form-actions button {
      min-width: 120px;
    }

    .form-actions button[mat-raised-button] {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    mat-spinner {
      margin-right: 8px;
    }

    @media (max-width: 768px) {
      .form-container {
        padding: 10px;
      }

      .form-row {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .form-actions {
        flex-direction: column;
      }

      .form-actions button {
        width: 100%;
      }
    }
  `]
})
export class EnquiryFormComponent {
  enquiryForm: FormGroup;
  isSubmitting = signal(false);

  constructor(
    private fb: FormBuilder,
    private enquiryService: EnquiryService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.enquiryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
    });
  }

  onSubmit(): void {
    if (this.enquiryForm.valid) {
      this.isSubmitting.set(true);
      
      const enquiryData: CreateEnquiryRequest = this.enquiryForm.value;
      
      this.enquiryService.createEnquiry(enquiryData).subscribe({
        next: (response) => {
          this.isSubmitting.set(false);
          this.snackBar.open('Enquiry submitted successfully!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/enquiries']);
        },
        error: (error) => {
          this.isSubmitting.set(false);
          this.snackBar.open('Failed to submit enquiry. Please try again.', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          console.error('Error submitting enquiry:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/enquiries']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.enquiryForm.controls).forEach(key => {
      const control = this.enquiryForm.get(key);
      control?.markAsTouched();
    });
  }
}
