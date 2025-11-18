import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  template: `
    <div class="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4 py-12">
      <div class="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8">
        <div class="flex flex-col items-center mb-8">
          <div class="bg-orange-100 p-3 rounded-full mb-4">
             <svg class="w-10 h-10 text-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
              </svg>
          </div>
          <h1 class="text-3xl font-bold text-gray-800">Vendor Registration</h1>
          <p class="text-gray-500 mt-2">Create your account to get started.</p>
        </div>
        
        <form class="space-y-8" [formGroup]="registrationForm" (ngSubmit)="onSubmit()">
            <!-- Company Details -->
            <fieldset class="space-y-4">
                <legend class="text-lg font-semibold text-gray-700 border-b border-gray-200 w-full pb-2">Company Details</legend>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Company Name *</label>
                        <input type="text" class="form-input" formControlName="companyName">
                         @if(registrationForm.get('companyName')?.invalid && registrationForm.get('companyName')?.touched) {
                           <p class="validation-error">Company name is required.</p>
                         }
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Referred By (Employee Code)</label>
                        <input type="text" class="form-input" formControlName="referredBy">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Company Identification Number (CIN) *</label>
                        <input type="text" class="form-input" formControlName="cin">
                         @if(registrationForm.get('cin')?.invalid && registrationForm.get('cin')?.touched) {
                           <p class="validation-error">CIN is required.</p>
                         }
                    </div>
                     <div>
                        <label class="block text-sm font-medium text-gray-700">Business Category *</label>
                        <select class="form-input" formControlName="businessCategory">
                            <option value="">Select a category</option>
                            <option>IT Services & Consulting</option>
                            <option>Manufacturing</option>
                            <option>Logistics</option>
                            <option>Other</option>
                        </select>
                         @if(registrationForm.get('businessCategory')?.invalid && registrationForm.get('businessCategory')?.touched) {
                           <p class="validation-error">Business category is required.</p>
                         }
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-700">Registered Address *</label>
                        <textarea class="form-input" rows="3" formControlName="registeredAddress"></textarea>
                         @if(registrationForm.get('registeredAddress')?.invalid && registrationForm.get('registeredAddress')?.touched) {
                           <p class="validation-error">Address is required.</p>
                         }
                    </div>
                </div>
            </fieldset>

            <!-- Contact Details -->
            <fieldset class="space-y-4">
                <legend class="text-lg font-semibold text-gray-700 border-b border-gray-200 w-full pb-2">Contact Details</legend>
                 <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Contact Person *</label>
                        <input type="text" class="form-input" formControlName="contactPerson">
                         @if(registrationForm.get('contactPerson')?.invalid && registrationForm.get('contactPerson')?.touched) {
                           <p class="validation-error">Contact person is required.</p>
                         }
                    </div>
                     <div>
                        <label class="block text-sm font-medium text-gray-700">Email ID *</label>
                        <input type="email" class="form-input" formControlName="email">
                         @if(registrationForm.get('email')?.touched && registrationForm.get('email')?.errors?.['required']) {
                           <p class="validation-error">Email is required.</p>
                         }
                         @if(registrationForm.get('email')?.touched && registrationForm.get('email')?.errors?.['email']) {
                           <p class="validation-error">Please enter a valid email address.</p>
                         }
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Mobile Number *</label>
                        <input type="tel" class="form-input" formControlName="mobileNumber">
                         @if(registrationForm.get('mobileNumber')?.invalid && registrationForm.get('mobileNumber')?.touched) {
                           <p class="validation-error">Mobile number is required.</p>
                         }
                    </div>
                 </div>
            </fieldset>

            <!-- Tax & Bank Details -->
            <fieldset class="space-y-4">
                <legend class="text-lg font-semibold text-gray-700 border-b border-gray-200 w-full pb-2">Tax & Bank Details</legend>
                 <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">PAN Number *</label>
                        <input type="text" class="form-input" formControlName="panNumber">
                         @if(registrationForm.get('panNumber')?.invalid && registrationForm.get('panNumber')?.touched) {
                           <p class="validation-error">PAN is required.</p>
                         }
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">GST Number *</label>
                        <input type="text" class="form-input" formControlName="gstNumber">
                         @if(registrationForm.get('gstNumber')?.invalid && registrationForm.get('gstNumber')?.touched) {
                           <p class="validation-error">GST number is required.</p>
                         }
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Bank Name *</label>
                        <input type="text" class="form-input" formControlName="bankName">
                         @if(registrationForm.get('bankName')?.invalid && registrationForm.get('bankName')?.touched) {
                           <p class="validation-error">Bank name is required.</p>
                         }
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">IFSC Code *</label>
                        <input type="text" class="form-input" formControlName="ifscCode">
                         @if(registrationForm.get('ifscCode')?.invalid && registrationForm.get('ifscCode')?.touched) {
                           <p class="validation-error">IFSC code is required.</p>
                         }
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-700">Bank Account Number *</label>
                        <input type="text" class="form-input" formControlName="accountNumber">
                         @if(registrationForm.get('accountNumber')?.invalid && registrationForm.get('accountNumber')?.touched) {
                           <p class="validation-error">Account number is required.</p>
                         }
                    </div>
                 </div>
            </fieldset>
            
             <!-- Document Uploads -->
            <fieldset class="space-y-4">
                <legend class="text-lg font-semibold text-gray-700 border-b border-gray-200 w-full pb-2">Document Uploads</legend>
                 <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">PAN Card *</label>
                        <input type="file" id="pan-upload" class="hidden" (change)="onFileChange($event, 'panCard')">
                        <label for="pan-upload" class="btn-file-upload">
                           <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" /></svg>
                           <span class="truncate">{{ registrationForm.get('panCard')?.value?.name || 'Choose file' }}</span>
                        </label>
                         @if(registrationForm.get('panCard')?.invalid && registrationForm.get('panCard')?.touched) {
                           <p class="validation-error">PAN Card upload is required.</p>
                         }
                    </div>
                     <div>
                        <label class="block text-sm font-medium text-gray-700">GST Certificate *</label>
                        <input type="file" id="gst-upload" class="hidden" (change)="onFileChange($event, 'gstCertificate')">
                        <label for="gst-upload" class="btn-file-upload">
                           <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" /></svg>
                           <span class="truncate">{{ registrationForm.get('gstCertificate')?.value?.name || 'Choose file' }}</span>
                        </label>
                         @if(registrationForm.get('gstCertificate')?.invalid && registrationForm.get('gstCertificate')?.touched) {
                           <p class="validation-error">GST Certificate is required.</p>
                         }
                    </div>
                     <div>
                        <label class="block text-sm font-medium text-gray-700">Cancelled Cheque *</label>
                        <input type="file" id="cheque-upload" class="hidden" (change)="onFileChange($event, 'cancelledCheque')">
                        <label for="cheque-upload" class="btn-file-upload">
                           <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" /></svg>
                           <span class="truncate">{{ registrationForm.get('cancelledCheque')?.value?.name || 'Choose file' }}</span>
                        </label>
                         @if(registrationForm.get('cancelledCheque')?.invalid && registrationForm.get('cancelledCheque')?.touched) {
                           <p class="validation-error">Cancelled cheque is required.</p>
                         }
                    </div>
                     <div>
                        <label class="block text-sm font-medium text-gray-700">MSME Declaration</label>
                        <input type="file" id="msme-upload" class="hidden" (change)="onFileChange($event, 'msmeDeclaration')">
                        <label for="msme-upload" class="btn-file-upload">
                           <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" /></svg>
                           <span class="truncate">{{ registrationForm.get('msmeDeclaration')?.value?.name || 'Choose file' }}</span>
                        </label>
                    </div>
                 </div>
            </fieldset>

          <div class="mt-6">
             <button type="submit" [disabled]="registrationForm.invalid"
                  class="w-full bg-orange-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-transform transform hover:scale-105 disabled:bg-orange-300 disabled:cursor-not-allowed disabled:transform-none">
              Register
            </button>
          </div>
        </form>
        
        <p class="text-center text-gray-500 mt-6 text-sm">
          Already have an account? 
          <a routerLink="/login" class="font-medium text-orange-600 hover:text-orange-500">
            Login here
          </a>
        </p>
      </div>
    </div>
    <style>
      .form-input {
        @apply mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition;
      }
      .form-input.ng-invalid.ng-touched {
        @apply border-red-500 ring-red-500;
      }
      .btn-file-upload {
        @apply mt-1 w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer;
      }
      .validation-error {
        @apply text-red-600 text-sm mt-1;
      }
    </style>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, ReactiveFormsModule]
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  registrationForm = this.fb.group({
    // Company Details
    companyName: ['', Validators.required],
    referredBy: [''],
    cin: ['', Validators.required],
    businessCategory: ['', Validators.required],
    registeredAddress: ['', Validators.required],
    // Contact Details
    contactPerson: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    mobileNumber: ['', Validators.required],
    // Tax & Bank Details
    panNumber: ['', Validators.required],
    gstNumber: ['', Validators.required],
    bankName: ['', Validators.required],
    ifscCode: ['', Validators.required],
    accountNumber: ['', Validators.required],
    // Document Uploads
    panCard: [null as File | null, Validators.required],
    gstCertificate: [null as File | null, Validators.required],
    cancelledCheque: [null as File | null, Validators.required],
    msmeDeclaration: [null as File | null],
  });

  onFileChange(event: Event, controlName: string) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      this.registrationForm.patchValue({
        [controlName]: file
      });
      this.registrationForm.get(controlName)?.markAsTouched();
    }
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      // In a real app, you would use FormData to send files.
      // Here, we'll send the JSON data and the backend will just log it.
      const formData = { ...this.registrationForm.value };
      delete formData.panCard; // Don't send file objects
      delete formData.gstCertificate;
      delete formData.cancelledCheque;
      delete formData.msmeDeclaration;

      this.http.post(`${this.apiUrl}/register`, formData).subscribe({
        next: () => {
          alert('Registration successful! Please login.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Registration failed', err);
          alert('Registration failed. Please try again.');
        }
      });

    } else {
      // Mark all fields as touched to display validation errors
      this.registrationForm.markAllAsTouched();
    }
  }
}
