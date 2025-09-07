import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Enquiry, CreateEnquiryRequest, ApiResponse } from '../models/enquiry.model';

@Injectable({
  providedIn: 'root'
})
export class EnquiryService {
  private readonly API_URL = 'http://localhost:3000/api/enquiries'; // Replace with your actual API URL
  private enquiriesSubject = new BehaviorSubject<Enquiry[]>([]);
  public enquiries$ = this.enquiriesSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Get all enquiries
  getEnquiries(): Observable<ApiResponse<Enquiry[]>> {
    return this.http.get<ApiResponse<Enquiry[]>>(this.API_URL)
      .pipe(
        tap(response => {
          if (response.success) {
            this.enquiriesSubject.next(response.data);
          }
        }),
        catchError(this.handleError)
      );
  }

  // Create a new enquiry
  createEnquiry(enquiry: CreateEnquiryRequest): Observable<ApiResponse<Enquiry>> {
    return this.http.post<ApiResponse<Enquiry>>(this.API_URL, enquiry)
      .pipe(
        tap(response => {
          if (response.success) {
            const currentEnquiries = this.enquiriesSubject.value;
            this.enquiriesSubject.next([...currentEnquiries, response.data]);
          }
        }),
        catchError(this.handleError)
      );
  }

  // Get enquiry by ID
  getEnquiryById(id: number): Observable<ApiResponse<Enquiry>> {
    return this.http.get<ApiResponse<Enquiry>>(`${this.API_URL}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Update enquiry status
  updateEnquiryStatus(id: number, status: Enquiry['status']): Observable<ApiResponse<Enquiry>> {
    return this.http.patch<ApiResponse<Enquiry>>(`${this.API_URL}/${id}/status`, { status })
      .pipe(
        tap(response => {
          if (response.success) {
            const currentEnquiries = this.enquiriesSubject.value;
            const updatedEnquiries = currentEnquiries.map(enquiry => 
              enquiry.id === id ? { ...enquiry, status: response.data.status } : enquiry
            );
            this.enquiriesSubject.next(updatedEnquiries);
          }
        }),
        catchError(this.handleError)
      );
  }

  // Delete enquiry
  deleteEnquiry(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${id}`)
      .pipe(
        tap(response => {
          if (response.success) {
            const currentEnquiries = this.enquiriesSubject.value;
            const filteredEnquiries = currentEnquiries.filter(enquiry => enquiry.id !== id);
            this.enquiriesSubject.next(filteredEnquiries);
          }
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error('API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
