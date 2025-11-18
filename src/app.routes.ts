
import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const APP_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'empanelment',
    canActivate: [authGuard],
    loadComponent: () => import('./components/empanelment/empanelment.component').then(m => m.EmpanelmentComponent)
  },
  {
    path: 'work-orders',
    canActivate: [authGuard],
    loadComponent: () => import('./components/work-orders/work-orders.component').then(m => m.WorkOrdersComponent)
  },
  {
    path: 'delivery-tracking',
    canActivate: [authGuard],
    loadComponent: () => import('./components/delivery-tracking/delivery-tracking.component').then(m => m.DeliveryTrackingComponent)
  },
  {
    path: 'payments',
    canActivate: [authGuard],
    loadComponent: () => import('./components/payments/payments.component').then(m => m.PaymentsComponent)
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' }
];
