import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { EnquiryService } from '../../services/enquiry.service';
import { Enquiry } from '../../models/enquiry.model';

@Component({
  selector: 'app-enquiry-list',
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
    MatDialogModule
  ],
  template: `
    <div class="list-container">
      <mat-toolbar color="primary" class="list-header">
        <mat-icon>inbox</mat-icon>
        <span>Enquiries</span>
        <span class="spacer"></span>
        <button mat-fab color="accent" (click)="navigateToNewEnquiry()" matTooltip="New Enquiry">
          <mat-icon>add</mat-icon>
        </button>
      </mat-toolbar>

      <div class="content">
        @if (isLoading()) {
          <div class="loading-container">
            <mat-spinner></mat-spinner>
            <p>Loading enquiries...</p>
          </div>
        } @else if (enquiries().length === 0) {
          <div class="empty-state">
            <mat-icon class="empty-icon">inbox</mat-icon>
            <h2>No enquiries yet</h2>
            <p>Start by creating your first enquiry</p>
            <button mat-raised-button color="primary" (click)="navigateToNewEnquiry()">
              <mat-icon>add</mat-icon>
              Create Enquiry
            </button>
          </div>
        } @else {
          <div class="enquiries-grid">
            @for (enquiry of enquiries(); track enquiry.id) {
              <mat-card class="enquiry-card" (click)="viewEnquiry(enquiry.id!)">
                <mat-card-header>
                  <div mat-card-avatar class="enquiry-avatar">
                    <mat-icon>person</mat-icon>
                  </div>
                  <mat-card-title>{{ enquiry.name }}</mat-card-title>
                  <mat-card-subtitle>{{ enquiry.email }}</mat-card-subtitle>
                </mat-card-header>

                <mat-card-content>
                  <div class="enquiry-subject">
                    <mat-icon>subject</mat-icon>
                    <span>{{ enquiry.subject }}</span>
                  </div>
                  
                  <div class="enquiry-message">
                    {{ enquiry.message | slice:0:150 }}{{ enquiry.message.length > 150 ? '...' : '' }}
                  </div>

                  <div class="enquiry-meta">
                    <div class="enquiry-phone">
                      <mat-icon>phone</mat-icon>
                      <span>{{ enquiry.phone }}</span>
                    </div>
                    <div class="enquiry-date">
                      <mat-icon>schedule</mat-icon>
                      <span>{{ formatDate(enquiry.createdAt!) }}</span>
                    </div>
                  </div>
                </mat-card-content>

                <mat-card-actions>
                  <mat-chip 
                    [ngClass]="'status-' + enquiry.status"
                    class="status-chip">
                    {{ getStatusText(enquiry.status) }}
                  </mat-chip>
                  
                  <div class="action-buttons">
                    <button 
                      mat-icon-button 
                      (click)="viewEnquiry(enquiry.id!); $event.stopPropagation()"
                      matTooltip="View Details">
                      <mat-icon>visibility</mat-icon>
                    </button>
                    
                    <button 
                      mat-icon-button 
                      [matMenuTriggerFor]="statusMenu"
                      (click)="$event.stopPropagation()"
                      matTooltip="Change Status">
                      <mat-icon>more_vert</mat-icon>
                    </button>
                    
                    <mat-menu #statusMenu="matMenu">
                      <button mat-menu-item (click)="updateStatus(enquiry.id!, 'pending')">
                        <mat-icon>schedule</mat-icon>
                        <span>Mark as Pending</span>
                      </button>
                      <button mat-menu-item (click)="updateStatus(enquiry.id!, 'in-progress')">
                        <mat-icon>work</mat-icon>
                        <span>Mark as In Progress</span>
                      </button>
                      <button mat-menu-item (click)="updateStatus(enquiry.id!, 'resolved')">
                        <mat-icon>check_circle</mat-icon>
                        <span>Mark as Resolved</span>
                      </button>
                    </mat-menu>
                  </div>
                </mat-card-actions>
              </mat-card>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .list-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .list-header {
      margin-bottom: 20px;
      border-radius: 8px;
    }

    .list-header mat-icon {
      margin-right: 10px;
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

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
    }

    .empty-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #ccc;
      margin-bottom: 20px;
    }

    .empty-state h2 {
      color: #666;
      margin-bottom: 10px;
    }

    .empty-state p {
      color: #999;
      margin-bottom: 30px;
    }

    .enquiries-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 20px;
    }

    .enquiry-card {
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      border-radius: 12px;
    }

    .enquiry-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .enquiry-avatar {
      background: linear-gradient(45deg, #2196F3, #21CBF3);
      color: white;
    }

    .enquiry-subject {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      font-weight: 500;
      color: #333;
    }

    .enquiry-subject mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .enquiry-message {
      color: #666;
      line-height: 1.5;
      margin-bottom: 16px;
    }

    .enquiry-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      color: #888;
    }

    .enquiry-phone,
    .enquiry-date {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .enquiry-phone mat-icon,
    .enquiry-date mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    mat-card-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
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

    .action-buttons {
      display: flex;
      gap: 4px;
    }

    @media (max-width: 768px) {
      .list-container {
        padding: 10px;
      }

      .enquiries-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .enquiry-meta {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
    }
  `]
})
export class EnquiryListComponent implements OnInit {
  enquiries = signal<Enquiry[]>([]);
  isLoading = signal(false);

  constructor(
    private enquiryService: EnquiryService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadEnquiries();
  }

  loadEnquiries(): void {
    this.isLoading.set(true);
    this.enquiryService.getEnquiries().subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success) {
          this.enquiries.set(response.data);
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.snackBar.open('Failed to load enquiries', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        console.error('Error loading enquiries:', error);
      }
    });
  }

  navigateToNewEnquiry(): void {
    this.router.navigate(['/enquiries/new']);
  }

  viewEnquiry(id: number): void {
    this.router.navigate(['/enquiries', id]);
  }

  updateStatus(id: number, status: Enquiry['status']): void {
    this.enquiryService.updateEnquiryStatus(id, status).subscribe({
      next: (response) => {
        if (response.success) {
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
