import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

import { EnquiryService } from '../../services/enquiry.service';
import { Enquiry } from '../../models/enquiry.model';

@Component({
  selector: 'app-enquiry-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatMenuModule,
    MatDividerModule
  ],
  template: `
    <div class="detail-container">
      <mat-toolbar color="primary" class="detail-header">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <span>Enquiry Details</span>
        <span class="spacer"></span>
        <button 
          mat-icon-button 
          [matMenuTriggerFor]="actionMenu"
          matTooltip="Actions">
          <mat-icon>more_vert</mat-icon>
        </button>
        
        <mat-menu #actionMenu="matMenu">
          <button mat-menu-item (click)="updateStatus('pending')">
            <mat-icon>schedule</mat-icon>
            <span>Mark as Pending</span>
          </button>
          <button mat-menu-item (click)="updateStatus('in-progress')">
            <mat-icon>work</mat-icon>
            <span>Mark as In Progress</span>
          </button>
          <button mat-menu-item (click)="updateStatus('resolved')">
            <mat-icon>check_circle</mat-icon>
            <span>Mark as Resolved</span>
          </button>
        </mat-menu>
      </mat-toolbar>

      <div class="content">
        @if (isLoading()) {
          <div class="loading-container">
            <mat-spinner></mat-spinner>
            <p>Loading enquiry details...</p>
          </div>
        } @else if (enquiry()) {
          <div class="detail-grid">
            <!-- Contact Information -->
            <mat-card class="info-card">
              <mat-card-header>
                <div mat-card-avatar class="contact-avatar">
                  <mat-icon>person</mat-icon>
                </div>
                <mat-card-title>Contact Information</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="info-item">
                  <mat-icon>person</mat-icon>
                  <div class="info-content">
                    <label>Name</label>
                    <span>{{ enquiry()?.name }}</span>
                  </div>
                </div>
                
                <div class="info-item">
                  <mat-icon>email</mat-icon>
                  <div class="info-content">
                    <label>Email</label>
                    <span>{{ enquiry()?.email }}</span>
                  </div>
                </div>
                
                <div class="info-item">
                  <mat-icon>phone</mat-icon>
                  <div class="info-content">
                    <label>Phone</label>
                    <span>{{ enquiry()?.phone }}</span>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>

            <!-- Enquiry Details -->
            <mat-card class="info-card">
              <mat-card-header>
                <div mat-card-avatar class="enquiry-avatar">
                  <mat-icon>inbox</mat-icon>
                </div>
                <mat-card-title>Enquiry Details</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="info-item">
                  <mat-icon>subject</mat-icon>
                  <div class="info-content">
                    <label>Subject</label>
                    <span>{{ enquiry()?.subject }}</span>
                  </div>
                </div>
                
                <div class="info-item">
                  <mat-icon>schedule</mat-icon>
                  <div class="info-content">
                    <label>Status</label>
                    <mat-chip 
                      [ngClass]="'status-' + enquiry()?.status"
                      class="status-chip">
                      {{ getStatusText(enquiry()?.status!) }}
                    </mat-chip>
                  </div>
                </div>
                
                <div class="info-item">
                  <mat-icon>access_time</mat-icon>
                  <div class="info-content">
                    <label>Created</label>
                    <span>{{ formatDate(enquiry()?.createdAt!) }}</span>
                  </div>
                </div>
                
                @if (enquiry()?.updatedAt && enquiry()?.updatedAt !== enquiry()?.createdAt) {
                  <div class="info-item">
                    <mat-icon>update</mat-icon>
                    <div class="info-content">
                      <label>Last Updated</label>
                      <span>{{ formatDate(enquiry()?.updatedAt!) }}</span>
                    </div>
                  </div>
                }
              </mat-card-content>
            </mat-card>

            <!-- Message -->
            <mat-card class="message-card">
              <mat-card-header>
                <div mat-card-avatar class="message-avatar">
                  <mat-icon>message</mat-icon>
                </div>
                <mat-card-title>Message</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="message-content">
                  {{ enquiry()?.message }}
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        } @else {
          <div class="error-state">
            <mat-icon class="error-icon">error</mat-icon>
            <h2>Enquiry not found</h2>
            <p>The enquiry you're looking for doesn't exist or has been removed.</p>
            <button mat-raised-button color="primary" (click)="goBack()">
              <mat-icon>arrow_back</mat-icon>
              Go Back
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .detail-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 20px;
    }

    .detail-header {
      margin-bottom: 20px;
      border-radius: 8px;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .content {
      min-height: 400px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
    }

    .loading-container p {
      margin-top: 20px;
      color: #666;
    }

    .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
    }

    .error-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #f44336;
      margin-bottom: 20px;
    }

    .error-state h2 {
      color: #666;
      margin-bottom: 10px;
    }

    .error-state p {
      color: #999;
      margin-bottom: 30px;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto auto;
      gap: 20px;
    }

    .info-card,
    .message-card {
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .message-card {
      grid-column: 1 / -1;
    }

    .contact-avatar {
      background: linear-gradient(45deg, #2196F3, #21CBF3);
      color: white;
    }

    .enquiry-avatar {
      background: linear-gradient(45deg, #4CAF50, #8BC34A);
      color: white;
    }

    .message-avatar {
      background: linear-gradient(45deg, #FF9800, #FFC107);
      color: white;
    }

    .info-item {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 20px;
    }

    .info-item:last-child {
      margin-bottom: 0;
    }

    .info-item mat-icon {
      color: #666;
      margin-top: 4px;
    }

    .info-content {
      flex: 1;
    }

    .info-content label {
      display: block;
      font-size: 12px;
      font-weight: 500;
      color: #999;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }

    .info-content span {
      display: block;
      font-size: 16px;
      color: #333;
      word-break: break-word;
    }

    .status-chip {
      font-weight: 500;
      text-transform: capitalize;
    }

    .status-pending {
      background-color: #fff3cd;
      color: #856404;
    }

    .status-in-progress {
      background-color: #d1ecf1;
      color: #0c5460;
    }

    .status-resolved {
      background-color: #d4edda;
      color: #155724;
    }

    .message-content {
      font-size: 16px;
      line-height: 1.6;
      color: #333;
      white-space: pre-wrap;
      word-break: break-word;
    }

    @media (max-width: 768px) {
      .detail-container {
        padding: 10px;
      }

      .detail-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .info-item {
        flex-direction: column;
        gap: 8px;
      }

      .info-item mat-icon {
        margin-top: 0;
      }
    }
  `]
})
export class EnquiryDetailComponent implements OnInit {
  enquiry = signal<Enquiry | null>(null);
  isLoading = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private enquiryService: EnquiryService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEnquiry(+id);
    }
  }

  loadEnquiry(id: number): void {
    this.isLoading.set(true);
    this.enquiryService.getEnquiryById(id).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success) {
          this.enquiry.set(response.data);
        } else {
          this.enquiry.set(null);
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.enquiry.set(null);
        this.snackBar.open('Failed to load enquiry details', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        console.error('Error loading enquiry:', error);
      }
    });
  }

  updateStatus(status: Enquiry['status']): void {
    const enquiry = this.enquiry();
    if (enquiry?.id) {
      this.enquiryService.updateEnquiryStatus(enquiry.id, status).subscribe({
        next: (response) => {
          if (response.success) {
            this.enquiry.set({ ...enquiry, status: response.data.status });
            this.snackBar.open('Status updated successfully', 'Close', {
              duration: 2000,
              panelClass: ['success-snackbar']
            });
          }
        },
        error: (error) => {
          this.snackBar.open('Failed to update status', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          console.error('Error updating status:', error);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/enquiries']);
  }

  getStatusText(status: Enquiry['status']): string {
    switch (status) {
      case 'pending': return 'Pending';
      case 'in-progress': return 'In Progress';
      case 'resolved': return 'Resolved';
      default: return status;
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
