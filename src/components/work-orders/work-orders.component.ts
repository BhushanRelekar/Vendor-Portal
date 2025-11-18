import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorDataService } from '../../services/vendor-data.service';
import { WorkOrder } from '../../models/vendor.model';

@Component({
  selector: 'app-work-orders',
  template: `
    <div>
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Work Orders</h1>
      <div class="bg-white rounded-lg shadow-md border border-gray-200 overflow-x-auto">
         <table class="w-full text-sm text-left text-gray-500">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3">Order ID</th>
              <th scope="col" class="px-6 py-3">Requested By</th>
              <th scope="col" class="px-6 py-3">Quantity</th>
              <th scope="col" class="px-6 py-3">Deadline</th>
              <th scope="col" class="px-6 py-3">Status</th>
              <th scope="col" class="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for(order of workOrders(); track order.workOrderId) {
              <tr class="bg-white border-b hover:bg-orange-50">
                <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{{ order.workOrderId }}</td>
                <td class="px-6 py-4">{{ order.requestedBy.name }}</td>
                <td class="px-6 py-4">{{ order.quantity }}</td>
                <td class="px-6 py-4">{{ order.deliveryDeadline }}</td>
                <td class="px-6 py-4">
                   <span class="px-2 py-1 text-xs font-semibold rounded-full"
                      [class]="getStatusClass(order.status)">
                    {{ order.status }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  @if(order.status === 'Pending') {
                    <div class="flex justify-center space-x-2">
                      <button (click)="updateStatus(order.workOrderId, 'Accepted')" class="text-xs bg-green-500 text-white font-bold py-2 px-3 rounded-md hover:bg-green-600 transition">Accept</button>
                      <button (click)="updateStatus(order.workOrderId, 'Rejected')" class="text-xs bg-red-500 text-white font-bold py-2 px-3 rounded-md hover:bg-red-600 transition">Reject</button>
                    </div>
                  } @else {
                    <div class="text-center">
                      <a href="#" class="font-medium text-orange-600 hover:underline">View</a>
                    </div>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class WorkOrdersComponent {
  vendorDataService = inject(VendorDataService);
  workOrders = this.vendorDataService.workOrders;
  
  getStatusClass(status: WorkOrder['status']): string {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Accepted': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  updateStatus(orderId: string, status: 'Accepted' | 'Rejected') {
      this.vendorDataService.updateWorkOrderStatus(orderId, status).subscribe({
          next: () => console.log(`Order ${orderId} updated to ${status}`),
          error: (err) => console.error(`Failed to update order ${orderId}`, err)
      });
  }
}
