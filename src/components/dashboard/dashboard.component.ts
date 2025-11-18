import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorDataService } from '../../services/vendor-data.service';
import { WorkOrder } from '../../models/vendor.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="space-y-8">
      @if (authService.currentUser(); as user) {
        <div>
          <h1 class="text-3xl font-bold text-gray-800">Welcome, {{ user.vendorName }}</h1>
          <p class="text-gray-500 mt-1">Here's a summary of your portal activity.</p>
        </div>
      }

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 transition-transform transform hover:scale-105">
          <div class="bg-orange-100 p-3 rounded-full">
            <svg class="w-8 h-8 text-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-500">Pending Work Orders</p>
            <p class="text-3xl font-bold text-gray-800">{{ pendingWorkOrders() }}</p>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 transition-transform transform hover:scale-105">
          <div class="bg-green-100 p-3 rounded-full">
             <svg class="w-8 h-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-500">Pending Payments</p>
            <p class="text-3xl font-bold text-gray-800">{{ pendingPayments() }}</p>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 transition-transform transform hover:scale-105">
          <div class="bg-blue-100 p-3 rounded-full">
            <svg class="w-8 h-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-500">Deliveries in Transit</p>
            <p class="text-3xl font-bold text-gray-800">{{ deliveriesInTransit() }}</p>
          </div>
        </div>
         <div class="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 transition-transform transform hover:scale-105">
          <div class="bg-red-100 p-3 rounded-full">
            <svg class="w-8 h-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-500">TAT Breaches</p>
            <p class="text-3xl font-bold text-red-600">{{ tatBreaches() }}</p>
          </div>
        </div>
      </div>
      
      <!-- Recent Activity -->
      <div>
        <h2 class="text-xl font-bold text-gray-800 mb-4">Recent Work Orders</h2>
        <div class="bg-white rounded-lg shadow-md border border-gray-200 overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-500">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3">Order ID</th>
                <th scope="col" class="px-6 py-3">Deadline</th>
                <th scope="col" class="px-6 py-3">Status</th>
                <th scope="col" class="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for(order of recentWorkOrders(); track order.workOrderId) {
                <tr class="bg-white border-b hover:bg-orange-50">
                  <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{{ order.workOrderId }}</td>
                  <td class="px-6 py-4">{{ order.deliveryDeadline }}</td>
                  <td class="px-6 py-4">
                     <span class="px-2 py-1 text-xs font-semibold rounded-full"
                        [class]="getStatusClass(order.status)">
                      {{ order.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <a href="#" class="font-medium text-orange-600 hover:underline">View Details</a>
                  </td>
                </tr>
              } @empty {
                 <tr class="bg-white border-b"><td colspan="4" class="px-6 py-4 text-center text-gray-500">No recent work orders.</td></tr>
              }
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class DashboardComponent {
  vendorData = inject(VendorDataService);
  authService = inject(AuthService);

  pendingWorkOrders = computed(() => 
    this.vendorData.workOrders().filter(o => o.status === 'Pending').length
  );
  pendingPayments = computed(() => 
    this.vendorData.purchaseOrders().filter(p => p.paymentStatus === 'Pending').length
  );
  deliveriesInTransit = computed(() => 
    this.vendorData.deliveryUpdates().filter(d => d.currentStatus === 'Dispatched').length
  );
  tatBreaches = computed(() =>
    this.vendorData.purchaseOrders().filter(p => p.deliveryTatBreach).length
  );
  recentWorkOrders = computed(() => this.vendorData.workOrders().slice(0, 3));

  getStatusClass(status: WorkOrder['status']): string {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Accepted': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
