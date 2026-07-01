import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/layout/sidebar.component';
import { HeaderComponent } from './shared/layout/header.component';
import { ToastComponent } from './shared/overlays/toast.component';
import { ConfirmModalComponent } from './shared/overlays/confirm-modal.component';
import { CelebrationModalComponent } from './shared/overlays/celebration-modal.component';
import { AddStudentModalComponent } from './shared/modals/add-student-modal.component';
import { EditStudentModalComponent } from './shared/modals/edit-student-modal.component';
import { AddHadithModalComponent } from './shared/modals/add-hadith-modal.component';
import { EditHadithModalComponent } from './shared/modals/edit-hadith-modal.component';
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
      <!-- Skip-to-content link for keyboard users -->
      <a href="#main-content" class="fixed top-0 left-0 z-[999] -translate-y-full focus:translate-y-0 bg-[var(--color-primary)] text-white px-4 py-2 text-sm font-bold transition-transform outline-none">
        تخطى إلى المحتوى
      </a>
      <!-- Main layout with sidebar + header -->
      <div class="min-h-screen bg-[var(--color-canvas)] text-[var(--color-text-primary)] font-sans antialiased flex flex-col md:flex-row">
        <app-sidebar />
        <main id="main-content" class="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
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
    if (ok) {
      await this.state.loadAll();
    } else if (!this.router.url.startsWith('/login')) {
      this.router.navigate(['/login']);
    }
  }

}
