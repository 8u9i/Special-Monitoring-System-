import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
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
import { AddVocabListModalComponent } from './shared/modals/add-vocab-list-modal.component';
import { filter, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { TrackerState } from './state';

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
    AddVocabListModalComponent,
  ],
  template: `
    @if (isLoginPage()) {
      <!-- Login page: no sidebar/header -->
      <router-outlet />
    } @else {
      @if (state.loading()) {
        <!-- Loading state -->
        <div class="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
          <div class="flex flex-col items-center gap-4">
            <div class="w-10 h-10 border-3 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin"></div>
            <p class="text-sm text-[var(--color-text-secondary)] font-medium">جاري التحميل...</p>
          </div>
        </div>
      } @else {
        <!-- Mobile hamburger button -->
        <button (click)="sidebarOpen.set(!sidebarOpen())"
          class="md:hidden fixed top-3 left-3 z-50 p-2 rounded-none bg-[var(--color-nav)] text-white shadow-lg cursor-pointer border-none">
          <span class="material-icons">{{ sidebarOpen() ? 'close' : 'menu' }}</span>
        </button>

        <!-- Mobile sidebar overlay -->
        @if (sidebarOpen()) {
          <div class="md:hidden fixed inset-0 bg-black/40 z-30" (click)="sidebarOpen.set(false)"></div>
        }

        <!-- Main layout with sidebar + header -->
        <div class="min-h-screen bg-[#FAF9F6] text-[#2F2F2F] font-sans antialiased flex flex-col md:flex-row">
          <app-sidebar [class]="sidebarOpen() ? '' : 'max-md:hidden'" />
          <main class="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
            <app-header />
            <div style="animation: fadeSlideIn 0.3s ease-out both">
              <router-outlet />
            </div>
          </main>
        </div>
      }

      <!-- Global Overlays -->
      <app-toast />
      <app-confirm-modal />
      <app-celebration-modal />
      <app-add-student-modal />
      <app-edit-student-modal />
      <app-add-hadith-modal />
      <app-edit-hadith-modal />
      <app-add-vocab-list-modal />
    }
  `,
})
export class App {
  private router = inject(Router);
  state = inject(TrackerState);
  sidebarOpen = signal(false);

  private currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );

  isLoginPage = () => this.currentUrl()?.startsWith('/login') ?? false;
}
