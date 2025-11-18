import { ChangeDetectionStrategy, Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormArray, Validators } from '@angular/forms';
import { VendorDataService } from '../../services/vendor-data.service';
import { ElementCategory } from '../../models/vendor.model';

@Component({
  selector: 'app-profile',
  template: `
    @if(profile(); as p) {
      <div>
        <h1 class="text-3xl font-bold text-gray-800 mb-6">Vendor Profile</h1>
        <div class="bg-white p-8 rounded-lg shadow-md">

            @if(!isEditing()) {
              <!-- DISPLAY MODE -->
              <div class="display-mode">
                <div class="flex justify-between items-start mb-6">
                    <h2 class="text-xl font-bold text-orange-700">Company Information</h2>
                    <span class="px-3 py-1 text-sm font-semibold rounded-full"
                        [class]="p.status === 'Verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                      Status: {{ p.status }}
                    </span>
                </div>

                <dl class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                  <div class="field-item"><dt>Company Name</dt><dd>{{ p.vendorName }}</dd></div>
                  <div class="field-item"><dt>Contact Person</dt><dd>{{ p.contactPerson }}</dd></div>
                  <div class="field-item"><dt>Email</dt><dd>{{ p.email }}</dd></div>
                  <div class="field-item"><dt>Mobile Number</dt><dd>{{ p.mobileNumber }}</dd></div>
                  <div class="field-item"><dt>Company ID (CIN)</dt><dd>{{ p.cin }}</dd></div>
                  <div class="field-item"><dt>Business Category</dt><dd>{{ p.businessCategory }}</dd></div>
                  <div class="field-item md:col-span-2"><dt>Registered Address</dt><dd>{{ p.registeredAddress }}</dd></div>
                  <div class="field-item"><dt>Vendor ID</dt><dd>{{ p.vendorId || 'N/A' }}</dd></div>
                </dl>
                
                <div class="mt-8 pt-6 border-t">
                    <h2 class="text-xl font-bold text-orange-700 mb-6">Tax & Bank Details</h2>
                    <dl class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                        <div class="field-item"><dt>PAN Number</dt><dd>{{ p.panNumber }}</dd></div>
                        <div class="field-item"><dt>GST Number</dt><dd>{{ p.gstNumber }}</dd></div>
                        <div class="field-item"><dt>Bank Name</dt><dd>{{ p.bank.bankName }}</dd></div>
                        <div class="field-item"><dt>IFSC Code</dt><dd>{{ p.bank.ifsc }}</dd></div>
                        <div class="field-item"><dt>Account Number</dt><dd>{{ p.bank.accountNumber }}</dd></div>
                        <div class="field-item"><dt>UPI ID</dt><dd>{{ p.bank.upiId || 'N/A' }}</dd></div>
                    </dl>
                </div>

                <div class="mt-8 pt-6 border-t">
                    <h2 class="text-xl font-bold text-orange-700 mb-6">Delivery & Element Configuration</h2>
                    <dl class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                      <div class="field-item"><dt>Delivery Range</dt><dd>{{ p.deliveryRangeKm ? p.deliveryRangeKm + ' km' : 'Not set' }}</dd></div>
                      <div class="field-item md:col-span-2"><dt>Serviceable Cities</dt><dd>{{ p.deliveryZones?.join(', ') || 'Not set' }}</dd></div>
                    </dl>
                    <h3 class="text-lg font-semibold text-gray-700 mt-6 mb-2">Element Categories</h3>
                    @if(p.elementCategories && p.elementCategories.length > 0) {
                      <ul class="list-disc list-inside text-gray-800">
                        @for(cat of p.elementCategories; track cat.name) {
                          <li>{{cat.name}} - Max Quantity: {{cat.maxQuantity}}</li>
                        }
                      </ul>
                    } @else {
                      <p class="text-gray-500">No element categories defined.</p>
                    }
                </div>

                <div class="mt-8 text-right">
                    <button (click)="toggleEdit(true)" class="bg-orange-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition">
                      Edit Profile
                    </button>
                </div>
              </div>
            } @else {
              <!-- EDIT MODE -->
              <form [formGroup]="profileForm" (ngSubmit)="saveProfile()" class="edit-mode space-y-8">
                <fieldset>
                    <legend class="text-xl font-bold text-orange-700 mb-4">Company Information</legend>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label>Company Name</label><input class="form-input" formControlName="vendorName"></div>
                        <div><label>Contact Person</label><input class="form-input" formControlName="contactPerson"></div>
                        <div><label>Email</label><input class="form-input" formControlName="email"></div>
                        <div><label>Mobile Number</label><input class="form-input" formControlName="mobileNumber"></div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend class="text-xl font-bold text-orange-700 mb-4 pt-4 border-t">Delivery & Element Configuration</legend>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div><label>Delivery Range (km)</label><input type="number" class="form-input" formControlName="deliveryRangeKm"></div>
                         <div><label>Serviceable Cities (comma-separated)</label><input class="form-input" formControlName="deliveryZones"></div>
                    </div>
                    <div class="mt-6" formArrayName="elementCategories">
                       <h3 class="text-lg font-semibold text-gray-700 mb-2">Element Categories</h3>
                        @for (category of elementCategories.controls; track $index) {
                            <div [formGroupName]="$index" class="grid grid-cols-3 gap-2 items-center mb-2">
                                <input class="form-input col-span-1" placeholder="Category Name" formControlName="name">
                                <input type="number" class="form-input col-span-1" placeholder="Max Quantity" formControlName="maxQuantity">
                                <button type="button" (click)="removeElementCategory($index)" class="text-red-500 hover:text-red-700">Remove</button>
                            </div>
                        }
                        <button type="button" (click)="addElementCategory()" class="text-sm text-orange-600 hover:text-orange-800 font-semibold mt-2">
                           + Add Category
                        </button>
                    </div>
                </fieldset>

                <div class="mt-8 text-right space-x-4">
                  <button type="button" (click)="toggleEdit(false)" class="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition">Cancel</button>
                  <button type="submit" [disabled]="profileForm.invalid" class="bg-orange-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-orange-700 disabled:bg-orange-300 transition">Save Changes</button>
                </div>
              </form>
            }
        </div>
      </div>
    } @else {
      <p>Loading profile...</p>
    }

    <style>
      .field-item dt { @apply text-sm text-gray-500; }
      .field-item dd { @apply font-semibold text-gray-800; }
      .form-input { @apply mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition; }
      .edit-mode label { @apply block text-sm font-medium text-gray-700; }
    </style>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ProfileComponent {
  vendorDataService = inject(VendorDataService);
  fb = inject(FormBuilder);
  
  profile = this.vendorDataService.vendorProfile;
  isEditing = signal(false);

  profileForm = this.fb.group({
      vendorName: ['', Validators.required],
      contactPerson: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', Validators.required],
      deliveryRangeKm: [0],
      deliveryZones: [''],
      elementCategories: this.fb.array([])
  });

  constructor() {
      effect(() => {
          const p = this.profile();
          if (p) {
              this.profileForm.patchValue({
                  vendorName: p.vendorName,
                  contactPerson: p.contactPerson,
                  email: p.email,
                  mobileNumber: p.mobileNumber,
                  deliveryRangeKm: p.deliveryRangeKm || 0,
                  deliveryZones: p.deliveryZones?.join(', ') || ''
              });
              
              this.elementCategories.clear();
              p.elementCategories?.forEach(cat => {
                  this.elementCategories.push(this.fb.group({
                      name: [cat.name, Validators.required],
                      maxQuantity: [cat.maxQuantity, [Validators.required, Validators.min(1)]]
                  }));
              });
          }
      });
  }
  
  get elementCategories() {
      return this.profileForm.get('elementCategories') as FormArray;
  }

  addElementCategory() {
      const categoryForm = this.fb.group({
          name: ['', Validators.required],
          maxQuantity: [1, [Validators.required, Validators.min(1)]]
      });
      this.elementCategories.push(categoryForm);
  }

  removeElementCategory(index: number) {
      this.elementCategories.removeAt(index);
  }

  toggleEdit(editing: boolean) {
    this.isEditing.set(editing);
    // If cancelling, reset form to original profile data
    if (!editing && this.profile()) {
        const p = this.profile()!;
        this.profileForm.patchValue({
          vendorName: p.vendorName,
          contactPerson: p.contactPerson,
          email: p.email,
          mobileNumber: p.mobileNumber,
          deliveryRangeKm: p.deliveryRangeKm,
          deliveryZones: p.deliveryZones?.join(', ')
        });
    }
  }

  saveProfile() {
      if (this.profileForm.invalid) {
          return;
      }
      const formValue = this.profileForm.value;
      const updatedProfileData = {
          ...formValue,
          deliveryZones: formValue.deliveryZones?.split(',').map(s => s.trim()).filter(Boolean)
      };

      this.vendorDataService.updateProfile(updatedProfileData).subscribe(() => {
          this.isEditing.set(false);
      });
  }
}
