import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/enquiries',
    pathMatch: 'full'
  },
  {
    path: 'enquiries',
    loadComponent: () => import('./components/enquiry-list/enquiry-list.component').then(m => m.EnquiryListComponent)
  },
  {
    path: 'enquiries/new',
    loadComponent: () => import('./components/enquiry-form/enquiry-form.component').then(m => m.EnquiryFormComponent)
  },
  {
    path: 'enquiries/:id',
    loadComponent: () => import('./components/enquiry-detail/enquiry-detail.component').then(m => m.EnquiryDetailComponent)
  },
  {
    path: '**',
    redirectTo: '/enquiries'
  }
];
