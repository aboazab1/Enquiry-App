export interface Enquiry {
  id?: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'pending' | 'in-progress' | 'resolved';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateEnquiryRequest {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
