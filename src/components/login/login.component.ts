import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div class="flex flex-col items-center mb-6">
            <div class="bg-orange-100 p-3 rounded-full mb-4">
                <svg class="w-10 h-10 text-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
            </div>
            <h1 class="text-3xl font-bold text-gray-800">Vendor Portal Login</h1>
            <p class="text-gray-500 mt-2">Welcome back! Please enter your details.</p>
        </div>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="mb-4">
            <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input id="username" type="text" formControlName="username"
                   class="form-input" 
                   placeholder="Enter 'vendor'">
            @if(loginForm.get('username')?.invalid && loginForm.get('username')?.touched) {
              <p class="validation-error">Username is required.</p>
            }
          </div>
          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input id="password" type="password" formControlName="password"
                   class="form-input" 
                   placeholder="Enter 'password'">
             @if(loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
              <p class="validation-error">Password is required.</p>
            }
          </div>
          
          @if(errorMessage()) {
            <div class="mb-4 text-center text-red-600 bg-red-100 p-3 rounded-lg">
              {{ errorMessage() }}
            </div>
          }

          <button type="submit" [disabled]="loginForm.invalid || isLoading()"
                  class="w-full bg-orange-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-transform transform hover:scale-105 disabled:bg-orange-300 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center">
             @if (isLoading()) {
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Logging in...</span>
             } @else {
                <span>Login</span>
             }
          </button>
        </form>
        
        <p class="text-center text-gray-500 mt-6 text-sm">
          Don't have an account? 
          <a routerLink="/register" class="font-medium text-orange-600 hover:text-orange-500">
            Register here
          </a>
        </p>
      </div>
    </div>
    <style>
      .form-input {
        @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition;
      }
      .form-input.ng-invalid.ng-touched {
        @apply border-red-500 ring-red-500;
      }
      .validation-error {
        @apply text-red-600 text-sm mt-1;
      }
    </style>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, ReactiveFormsModule]
})
export class LoginComponent {
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  
  errorMessage = signal('');
  isLoading = signal(false);

  loginForm = this.fb.group({
    username: ['vendor', Validators.required],
    password: ['password', Validators.required],
  });

  onSubmit() {
    this.errorMessage.set('');
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const { username, password } = this.loginForm.value;

    this.authService.login(username!, password!).subscribe({
        next: (response) => {
            this.isLoading.set(false);
            if (!response.success) {
                this.errorMessage.set('Invalid username or password. Please try again.');
            }
        },
        error: () => {
            this.isLoading.set(false);
            this.errorMessage.set('An unexpected error occurred. Please try again later.');
        }
    });
  }
}
