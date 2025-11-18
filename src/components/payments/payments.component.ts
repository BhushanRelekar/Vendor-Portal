import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { VendorDataService } from '../../services/vendor-data.service';
import { PurchaseOrder } from '../../models/vendor.model';

@Component({
  selector: 'app-payments',
  template: `
     <div>
      <h1 class="text-3xl font-bold text-gray-800 mb-6">PO & Payment Status</h1>
      <div class="bg-white rounded-lg shadow-md border border-gray-200 overflow-x-auto">
         <table class="w-full text-sm text-left text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3">PO ID</th>
              <th scope="col" class="px-6 py-3">PO Amount</th>
              <th scope="col" class="px-6 py-3">Invoice ID</th>
              <th scope="col" class="px-6 py-3">Payment Status</th>
              <th scope="col" class="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for(po of purchaseOrders(); track po.poId) {
              <tr class="bg-white border-b hover:bg-orange-50">
                <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{{ po.poId }}</td>
                <td class="px-6 py-4">{{ po.poAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }}</td>
                <td class="px-6 py-4">{{ po.invoiceId || 'Not Uploaded' }}</td>
                <td class="px-6 py-4">
                   <span class="px-2 py-1 text-xs font-semibold rounded-full"
                      [class]="getStatusClass(po.paymentStatus)">
                    {{ po.paymentStatus }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  @if(!po.invoiceId) {
                     <button (click)="openInvoiceModal(po)" class="text-sm bg-orange-600 text-white font-bold py-2 px-4 rounded-md hover:bg-orange-700 transition">Upload Invoice</button>
                  } @else {
                    <a href="#" class="font-medium text-orange-600 hover:underline">View Details</a>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Upload Invoice Modal -->
    @if(isModalOpen() && selectedPO()) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div class="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg">
                <h2 class="text-2xl font-bold text-gray-800 mb-4">Upload Invoice for {{ selectedPO()?.poId }}</h2>
                <form [formGroup]="invoiceForm" (ngSubmit)="onUploadInvoice()">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Invoice ID</label>
                            <input formControlName="invoiceId" class="form-input" placeholder="e.g., INV-00123">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Invoice Amount</label>
                            <input type="number" formControlName="invoiceAmount" class="form-input">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Invoice Date</label>
                            <input type="date" formControlName="invoiceDate" class="form-input">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Upload Invoice (PDF)</label>
                            <input type="file" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100">
                        </div>
                    </div>
                    <div class="mt-6 flex justify-end space-x-4">
                        <button type="button" (click)="closeModal()" class="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancel</button>
                        <button type="submit" [disabled]="invoiceForm.invalid" class="bg-orange-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-700 disabled:bg-orange-300">Submit Invoice</button>
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
export class PaymentsComponent {
  vendorDataService = inject(VendorDataService);
  fb = inject(FormBuilder);
  purchaseOrders = this.vendorDataService.purchaseOrders;

  isModalOpen = signal(false);
  selectedPO = signal<PurchaseOrder | null>(null);

  invoiceForm = this.fb.group({
      invoiceId: ['', Validators.required],
      invoiceAmount: [0, [Validators.required, Validators.min(0.01)]],
      invoiceDate: ['', Validators.required]
  });

  openInvoiceModal(po: PurchaseOrder) {
      this.selectedPO.set(po);
      this.invoiceForm.patchValue({
          invoiceAmount: po.poAmount
      });
      this.isModalOpen.set(true);
  }

  closeModal() {
      this.isModalOpen.set(false);
      this.selectedPO.set(null);
      this.invoiceForm.reset();
  }
  
  onUploadInvoice() {
      if (this.invoiceForm.invalid || !this.selectedPO()) {
          return;
      }
      const poId = this.selectedPO()!.poId;
      const invoiceData = {
          invoiceId: this.invoiceForm.value.invoiceId!,
          invoiceAmount: this.invoiceForm.value.invoiceAmount!,
          invoiceDate: this.invoiceForm.value.invoiceDate!
      };
      
      this.vendorDataService.uploadInvoice(poId, invoiceData).subscribe(() => {
          this.closeModal();
      });
  }

  getStatusClass(status: PurchaseOrder['paymentStatus']): string {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
