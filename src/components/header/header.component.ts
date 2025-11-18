import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  template: `
    <header class="bg-white border-b border-gray-200 z-10">
      <div class="container mx-auto px-6 py-3 flex justify-between items-center">
        <div class="flex items-center space-x-4">
            <svg class="w-10 h-10 text-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6.375a.75.75 0 0 1 .75.75v3.375a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75V7.5a.75.75 0 0 1 .75-.75Zm0 6.375h6.375a.75.75 0 0 1 .75.75v3.375a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v-3.375a.75.75 0 0 1 .75-.75Z" />
            </svg>
            <h1 class="text-2xl font-bold text-gray-800">Vendor Portal</h1>
        </div>
        @if(authService.currentUser(); as user) {
        <div class="flex items-center space-x-4">
          <div class="text-right">
            <p class="font-semibold text-gray-700">{{ user.vendorName }}</p>
            <p class="text-sm text-gray-500">{{ user.email }}</p>
          </div>
          <button (click)="logout()" class="flex items-center text-gray-600 hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 rounded-full p-2 transition-colors">
             <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
            <span class="sr-only">Logout</span>
          </button>
        </div>
        }
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class HeaderComponent {
  authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
