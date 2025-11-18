
import { ChangeDetectionStrategy, Component, inject, effect } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

import { AuthService } from './services/auth.service';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LoginComponent } from './components/login/login.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent, LoginComponent],
})
export class AppComponent {
  authService = inject(AuthService);
  isLoggedIn = this.authService.isLoggedIn;
  
  private router = inject(Router);
  
  isAuthPage = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ), { initialValue: { url: this.router.url } as NavigationEnd }
  );

  constructor() {
    effect(() => {
      if (this.isLoggedIn()) {
        this.authService.loadInitialData();
      }
    });
  }

  showMainLayout(): boolean {
    const url = this.isAuthPage()?.url;
    return this.isLoggedIn() && url !== '/login' && url !== '/register';
  }
}
