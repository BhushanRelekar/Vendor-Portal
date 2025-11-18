import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import {
  VendorProfile,
  Empanelment,
  WorkOrder,
  DeliveryUpdate,
  PurchaseOrder,
} from '../models/vendor.model';

@Injectable({
  providedIn: 'root',
})
export class VendorDataService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  vendorProfile = signal<VendorProfile | null>(null);
  empanelment = signal<Empanelment | null>(null);
  workOrders = signal<WorkOrder[]>([]);
  deliveryUpdates = signal<DeliveryUpdate[]>([]);
  purchaseOrders = signal<PurchaseOrder[]>([]);

  getProfile() {
    return this.http.get<VendorProfile>(`${this.apiUrl}/vendor/profile`).pipe(
      tap(data => this.vendorProfile.set(data))
    );
  }
  
  updateProfile(profileData: Partial<VendorProfile>) {
    return this.http.put<VendorProfile>(`${this.apiUrl}/vendor/profile`, profileData).pipe(
        tap(updatedProfile => {
            this.vendorProfile.set(updatedProfile);
        })
    );
  }

  getEmpanelment() {
    return this.http.get<Empanelment>(`${this.apiUrl}/vendor/empanelment`).pipe(
      tap(data => this.empanelment.set(data))
    );
  }

  getWorkOrders() {
    return this.http.get<WorkOrder[]>(`${this.apiUrl}/vendor/work-orders`).pipe(
      tap(data => this.workOrders.set(data))
    );
  }
  
  updateWorkOrderStatus(orderId: string, status: 'Accepted' | 'Rejected') {
      return this.http.put<WorkOrder>(`${this.apiUrl}/work-orders/${orderId}`, { status }).pipe(
          tap(updatedOrder => {
              this.workOrders.update(orders => 
                  orders.map(o => o.workOrderId === orderId ? updatedOrder : o)
              );
          })
      );
  }

  getDeliveryUpdates() {
    return this.http.get<DeliveryUpdate[]>(`${this.apiUrl}/vendor/deliveries`).pipe(
      tap(data => this.deliveryUpdates.set(data))
    );
  }

  updateDelivery(workOrderId: string, updateData: Partial<DeliveryUpdate>) {
      return this.http.put<DeliveryUpdate>(`${this.apiUrl}/deliveries/${workOrderId}`, updateData).pipe(
          tap(updatedDelivery => {
              const exists = this.deliveryUpdates().some(d => d.workOrderId === workOrderId);
              if (exists) {
                  this.deliveryUpdates.update(deliveries =>
                      deliveries.map(d => d.workOrderId === workOrderId ? updatedDelivery : d)
                  );
              } else {
                  this.deliveryUpdates.update(deliveries => [...deliveries, updatedDelivery]);
              }
          })
      );
  }

  getPurchaseOrders() {
    return this.http.get<PurchaseOrder[]>(`${this.apiUrl}/vendor/payments`).pipe(
      tap(data => this.purchaseOrders.set(data))
    );
  }
  
  uploadInvoice(poId: string, invoiceData: { invoiceId: string, invoiceAmount: number, invoiceDate: string }) {
      return this.http.put<PurchaseOrder>(`${this.apiUrl}/payments/${poId}/invoice`, invoiceData).pipe(
          tap(updatedPO => {
              this.purchaseOrders.update(pos => 
                  pos.map(p => p.poId === poId ? updatedPO : p)
              );
          })
      );
  }
}
