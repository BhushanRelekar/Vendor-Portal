import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { VendorDataService } from '../../services/vendor-data.service';
import { DeliveryUpdate } from '../../models/vendor.model';

@Component({
  selector: 'app-delivery-tracking',
  template: `
    <div>
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Delivery Tracking</h1>
      <div class="bg-white rounded-lg shadow-md border border-gray-200 overflow-x-auto">
         <table class="w-full text-sm text-left text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3">Work Order ID</th>
              <th scope="col" class="px-6 py-3">Current Status</th>
              <th scope="col" class="px-6 py-3">Dispatch Date</th>
              <th scope="col" class="px-6 py-3">Expected Delivery</th>
              <th scope="col" class="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for(delivery of deliveryUpdates(); track delivery.workOrderId) {
              <tr class="bg-white border-b hover:bg-orange-50">
                <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{{ delivery.workOrderId }}</td>
                <td class="px-6 py-4">
                   <span class="px-2 py-1 text-xs font-semibold rounded-full"
                      [class]="getStatusClass(delivery.currentStatus)">
                    {{ delivery.currentStatus }}
                  </span>
                </td>
                 <td class="px-6 py-4">{{ delivery.dispatchDate || 'N/A' }}</td>
                 <td class="px-6 py-4">{{ delivery.expectedDeliveryDate }}</td>
                <td class="px-6 py-4">
                  <button (click)="openUpdateModal(delivery)" class="text-sm bg-orange-600 text-white font-bold py-2 px-4 rounded-md hover:bg-orange-700 transition">Update Status</button>
                </td>
              </tr>
            } @empty {
               <tr class="bg-white border-b"><td colspan="5" class="px-6 py-4 text-center text-gray-500">No active deliveries to track.</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <!-- Update Status Modal -->
    @if(isModalOpen() && selectedDelivery()) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div class="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg">
                <h2 class="text-2xl font-bold text-gray-800 mb-4">Update Delivery for {{ selectedDelivery()?.workOrderId }}</h2>
                <form [formGroup]="deliveryForm" (ngSubmit)="onUpdateDelivery()">
                    <div class="space-y-4">
                         <div>
                            <label class="block text-sm font-medium text-gray-700">Status</label>
                            <select formControlName="currentStatus" class="form-input">
                                <option value="Dispatched">Dispatched</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Delayed">Delayed</option>
                            </select>
                         </div>
                         <div>
                            <label class="block text-sm font-medium text-gray-700">Dispatch Date</label>
                            <input type="date" formControlName="dispatchDate" class="form-input">
                         </div>
                         <div>
                            <label class="block text-sm font-medium text-gray-700">Expected Delivery Date</label>
                            <input type="date" formControlName="expectedDeliveryDate" class="form-input">
                         </div>
                         <div>
                            <label class="block text-sm font-medium text-gray-700">Remarks</label>
                            <textarea formControlName="remarks" class="form-input" rows="2"></textarea>
                         </div>
                    </div>
                    <div class="mt-6 flex justify-end space-x-4">
                        <button type="button" (click)="closeModal()" class="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancel</button>
                        <button type="submit" [disabled]="deliveryForm.invalid" class="bg-orange-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-700 disabled:bg-orange-300">Update</button>
                    </div>
                </form>
            </div>
        </div>
    }
     <style>
      .form-input { @apply mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition; }
    </style>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule]
})
export class DeliveryTrackingComponent {
  vendorDataService = inject(VendorDataService);
  fb = inject(FormBuilder);
  deliveryUpdates = this.vendorDataService.deliveryUpdates;
  
  isModalOpen = signal(false);
  selectedDelivery = signal<DeliveryUpdate | null>(null);

  deliveryForm = this.fb.group({
      currentStatus: ['', Validators.required],
      dispatchDate: [''],
      expectedDeliveryDate: ['', Validators.required],
      remarks: ['']
  });

  openUpdateModal(delivery: DeliveryUpdate) {
      this.selectedDelivery.set(delivery);
      this.deliveryForm.patchValue({
          currentStatus: delivery.currentStatus,
          dispatchDate: this.formatDate(delivery.dispatchDate),
          expectedDeliveryDate: this.formatDate(delivery.expectedDeliveryDate),
          remarks: delivery.remarks || ''
      });
      this.isModalOpen.set(true);
  }

  closeModal() {
      this.isModalOpen.set(false);
      this.selectedDelivery.set(null);
  }
  
  onUpdateDelivery() {
      if (this.deliveryForm.invalid || !this.selectedDelivery()) {
          return;
      }
      const workOrderId = this.selectedDelivery()!.workOrderId;
      this.vendorDataService.updateDelivery(workOrderId, this.deliveryForm.value).subscribe(() => {
          this.closeModal();
      });
  }

  private formatDate(dateStr?: string): string {
      if (!dateStr) return '';
      // Assuming date is in 'YYYY-MM-DD' format which is what <input type="date"> needs
      return new Date(dateStr).toISOString().split('T')[0];
  }

  getStatusClass(status: DeliveryUpdate['currentStatus']): string {
    switch (status) {
      case 'Dispatched': return 'bg-blue-100 text-blue-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
