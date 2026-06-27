import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { SidebarComponent } from './shared/layout/sidebar.component';
import { HeaderComponent } from './shared/layout/header.component';
import { ToastComponent } from './shared/overlays/toast.component';
import { ConfirmModalComponent } from './shared/overlays/confirm-modal.component';
import { CelebrationModalComponent } from './shared/overlays/celebration-modal.component';
import { AddStudentModalComponent } from './shared/modals/add-student-modal.component';
import { EditStudentModalComponent } from './shared/modals/edit-student-modal.component';
import { AddHadithModalComponent } from './shared/modals/add-hadith-modal.component';
import { EditHadithModalComponent } from './shared/modals/edit-hadith-modal.component';
import { filter, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { TrackerState } from './state';
import { AuthService } from './auth.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  styleUrl: './app.css',
  imports: [
    RouterOutlet,
    SidebarComponent,
    HeaderComponent,
    ToastComponent,
    ConfirmModalComponent,
    CelebrationModalComponent,
    AddStudentModalComponent,
    EditStudentModalComponent,
    AddHadithModalComponent,
    EditHadithModalComponent,
  ],
  template: `
    @if (!auth.authChecked()) {
      <!-- BLOCK ALL RENDERING until auth check completes -->
      <div class="min-h-screen bg-[var(--color-canvas)] flex items-center justify-center">
        <div class="w-10 h-10 border-3 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin"></div>
      </div>
    } @else if (!auth.authenticated()) {
      <!-- NOT AUTHENTICATED — show login only, zero app chrome -->
      <router-outlet />
    } @else if (state.loading()) {
      <!-- Authenticated but data still loading -->
      <div class="min-h-screen bg-[var(--color-canvas)] flex items-center justify-center">
        <div class="flex flex-col items-center gap-4">
          <div class="w-10 h-10 border-3 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin"></div>
          <p class="text-sm text-[var(--color-text-secondary)] font-medium">جاري التحميل...</p>
        </div>
      </div>
    } @else {
      <!-- FULLY AUTHENTICATED + DATA LOADED -->
      <!-- Main layout with sidebar + header -->
      <div class="min-h-screen bg-[var(--color-canvas)] text-[var(--color-text-primary)] font-sans antialiased flex flex-col md:flex-row">
        <app-sidebar />
        <main class="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          <app-header />
          <div style="animation: fadeSlideIn 0.3s ease-out both">
            <router-outlet />
          </div>
        </main>
      </div>

      <!-- Global Overlays -->
      <app-toast />
      <app-confirm-modal />
      <app-celebration-modal />
      <app-add-student-modal />
      <app-edit-student-modal />
      <app-add-hadith-modal />
      <app-edit-hadith-modal />
    }
  `,
})
export class App implements OnInit {
  private router = inject(Router);
  auth = inject(AuthService);
  state = inject(TrackerState);

  async ngOnInit() {
    const ok = await this.auth.checkAuth();
    if (!ok && !this.router.url.startsWith('/login')) {
      this.router.navigate(['/login']);
    }
  }

  private currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );

  isLoginPage = () => this.currentUrl()?.startsWith('/login') ?? false;
}
