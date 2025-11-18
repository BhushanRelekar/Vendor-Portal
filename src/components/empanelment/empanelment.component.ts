import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorDataService } from '../../services/vendor-data.service';

@Component({
  selector: 'app-empanelment',
  template: `
    <div>
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Empanelment Status</h1>
      @if (empanelment(); as emp) {
        <div class="bg-white p-8 rounded-lg shadow-md">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 class="text-xl font-bold text-orange-700 mb-4">Onboarding Details</h2>
                <dl class="space-y-3">
                    <div class="flex justify-between"><dt class="font-semibold text-gray-600">Empanelment ID:</dt><dd class="text-gray-800">{{ emp.empanelmentId }}</dd></div>
                    <div class="flex justify-between"><dt class="font-semibold text-gray-600">Onboarding Date:</dt><dd class="text-gray-800">{{ emp.onboardingDate }}</dd></div>
                    <div class="flex justify-between"><dt class="font-semibold text-gray-600">Vendor Category:</dt><dd class="text-gray-800">{{ emp.vendorCategory }}</dd></div>
                    <div class="flex justify-between"><dt class="font-semibold text-gray-600">Documents Verified:</dt><dd class="text-gray-800">{{ emp.documentsVerified ? 'Yes' : 'No' }}</dd></div>
                </dl>
              </div>
              <div class="text-center p-6 rounded-lg" 
                  [class]="statusInfo[emp.empanelmentStatus].bg">
                  <p class="text-lg font-semibold" [class]="statusInfo[emp.empanelmentStatus].text">Empanelment Status</p>
                  <p class="text-4xl font-bold mt-2" [class]="statusInfo[emp.empanelmentStatus].text">
                    {{ emp.empanelmentStatus }}
                  </p>
                  @if(emp.approvalDate) {
                    <p class="mt-2 text-sm" [class]="statusInfo[emp.empanelmentStatus].text">Approved on: {{ emp.approvalDate }}</p>
                  }
              </div>
          </div>

          <div class="mt-8 border-t pt-6">
            <h2 class="text-xl font-bold text-orange-700 mb-4">Documents & Agreement</h2>
            <p class="text-gray-600 mb-4">Review the agreement and upload your signed documents to complete the empanelment process.</p>
            <div class="flex flex-wrap gap-4 items-center">
              <button class="flex items-center space-x-2 bg-white text-orange-600 border border-orange-600 font-semibold py-2 px-4 rounded-lg hover:bg-orange-50 transition">
                  <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                  <span>Download Agreement</span>
              </button>
              <button class="bg-orange-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-700 transition flex items-center space-x-2">
                  <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" /></svg>
                <span>Upload Signed Documents</span>
              </button>
            </div>
            @if(!emp.agreementAccepted) {
              <div class="mt-6 flex items-center">
                <input id="agreement" type="checkbox" class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded">
                <label for="agreement" class="ml-2 block text-sm text-gray-900">
                  I accept the terms of the empanelment agreement.
                </label>
              </div>
            } @else {
              <p class="mt-6 text-green-700 font-semibold flex items-center space-x-2">
                  <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                  <span>Agreement Accepted</span>
                </p>
            }
          </div>
        </div>
      } @else {
        <p>Loading empanelment data...</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class EmpanelmentComponent {
  vendorDataService = inject(VendorDataService);
  empanelment = this.vendorDataService.empanelment;

  statusInfo: Record<string, { bg: string, text: string }> = {
    Approved: { bg: 'bg-green-100', text: 'text-green-800'},
    Pending: { bg: 'bg-yellow-100', text: 'text-yellow-800'},
    Rejected: { bg: 'bg-red-100', text: 'text-red-800'}
  };
}
