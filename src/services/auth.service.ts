
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { VendorProfile } from '../models/vendor.model';
import { VendorDataService } from './vendor-data.service';
import { catchError, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private http = inject(HttpClient);
  private vendorDataService = inject(VendorDataService);
  private apiUrl = 'http://localhost:3000/api';

  isLoggedIn = signal<boolean>(false);
  currentUser = signal<VendorProfile | null>(null);
  
  constructor() {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.isLoggedIn.set(loggedIn);
    if (loggedIn) {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            this.currentUser.set(JSON.parse(storedUser));
        }
    }
  }

  login(username: string, password: string) {
    return this.http.post<{ success: boolean, user: VendorProfile }>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap(response => {
          if (response.success) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            this.isLoggedIn.set(true);
            this.currentUser.set(response.user);
            this.router.navigate(['/dashboard']);
          }
        }),
        catchError(error => {
          console.error('Login failed', error);
          return of({ success: false, user: null! }); // Return a failed observable
        })
      );
  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    this.isLoggedIn.set(false);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  loadInitialData() {
    this.vendorDataService.getProfile().subscribe();
    this.vendorDataService.getEmpanelment().subscribe();
    this.vendorDataService.getWorkOrders().subscribe();
    this.vendorDataService.getDeliveryUpdates().subscribe();
    this.vendorDataService.getPurchaseOrders().subscribe();
  }
}
