import { Component, inject, signal, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TrackerState } from '../../state';
import { AuthService } from '../../auth.service';
import { ThemeService } from '../services/theme.service';
import { getAvatarEmoji } from '../constants/avatars';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <!-- Mobile hamburger bar (visible only on small screens) -->
    <div class="md:hidden flex items-center justify-between p-4 bg-[var(--color-nav)] border-b border-white/[0.04]">
      <button (click)="toggleMenu()" class="text-white/60 hover:text-white transition-colors cursor-pointer border-none" aria-label="فتح القائمة">
        <span class="material-icons text-2xl">menu</span>
      </button>
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-[var(--color-primary)] flex items-center justify-center">
          <span class="material-icons text-white text-sm">eco</span>
        </div>
        <span class="font-tajawal text-sm font-bold text-white">يا إخوتي</span>
      </div>
      <div class="w-8"></div>
    </div>

    <!-- Desktop sidebar + Mobile overlay -->
    @if (mobileMenuOpen()) {
    <div class="fixed inset-0 z-40 md:hidden" (click)="closeMenu()">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
    </div>
    }

    <aside class="
      w-full md:w-64 bg-[var(--color-nav)] flex flex-col justify-between shrink-0 border-l border-white/[0.04]
      md:block
      fixed md:static top-0 right-0 z-50 h-full md:h-auto
      transition-transform duration-300 ease-out
      max-md:max-w-xs
      max-md:shadow-2xl
      max-md:[transform:translateX(100%)]
      max-md:[&.open]:translate-x-0
    " [class.open]="mobileMenuOpen()">
      <div class="p-5">
        <div class="flex items-center gap-3 mb-8 pb-6 border-b border-white/[0.06]">
          <div class="w-10 h-10 bg-[var(--color-primary)] flex items-center justify-center">
            <span class="material-icons text-white text-xl">eco</span>
          </div>
          <div class="flex-1">
            <h1 class="font-tajawal text-lg font-bold text-white tracking-tight">يا إخوتي</h1>
            <p class="text-xs text-white/40 font-medium">متابع الحفظ التفاعلي</p>
          </div>
          <button (click)="closeMenu()" class="md:hidden text-white/40 hover:text-white transition-colors cursor-pointer border-none" aria-label="إغلاق القائمة">
            <span class="material-icons">close</span>
          </button>
        </div>

        @if (state.selectedStudent(); as student) {
        <div class="mb-6 p-4 bg-white/[0.04] border border-white/[0.06]">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-2 h-2 bg-[var(--color-green)]"></div>
            <p class="text-[11px] text-white/40 font-semibold tracking-wider">الطالب المحدد</p>
          </div>
          <div class="flex items-center gap-2.5 mb-3">
            <span class="text-xl">{{ getAvatarEmoji(student.avatar) }}</span>
            <span class="font-bold text-white text-sm">{{ student.name }}</span>
          </div>
          <div class="flex items-center justify-between text-xs">
            <span class="text-white/40">{{ getProgressLabel() }}:</span>
            <span class="font-semibold text-[var(--color-primary)]">{{ getProgressValue(student) }}</span>
          </div>
          <div class="flex items-center justify-between text-xs mt-2">
            <span class="text-[var(--color-nav-text-muted)]">المرحلة:</span>
            <span class="font-semibold text-[var(--color-amber)]">{{ getStudentStageName(student) }}</span>
          </div>
        </div>
        }

        <nav class="space-y-0.5">
          <a (click)="closeMenu()" routerLink="/dashboard" routerLinkActive="bg-[var(--color-nav-active)] text-[var(--color-nav-text)] border-r-2 border-[var(--color-primary)]" [routerLinkActiveOptions]="{ exact: true }"
            class="flex items-center gap-3 px-4 py-2.5 text-[var(--color-nav-text-muted)] hover:bg-[var(--color-nav-hover)] hover:text-[var(--color-nav-text)] transition-all text-sm font-medium border-r-2 border-transparent">
            <span class="material-icons text-xl">home</span>
            <span>الرئيسية</span>
          </a>

          <div class="pt-3 pb-1">
            <p class="px-4 text-[11px] font-bold text-white/20 tracking-widest mb-1">مسارات التعلم</p>
          </div>
          <a (click)="closeMenu()" routerLink="/hadith" routerLinkActive="bg-[var(--color-nav-active)] text-[var(--color-nav-text)] border-r-2 border-[var(--color-primary)]"
            class="flex items-center gap-3 px-4 py-2.5 text-[var(--color-nav-text-muted)] hover:bg-[var(--color-nav-hover)] hover:text-[var(--color-nav-text)] transition-all text-sm font-medium border-r-2 border-transparent">
            <span class="material-icons text-xl">menu_book</span>
            <span>مسار الأحاديث</span>
          </a>
          <a (click)="closeMenu()" routerLink="/quran" routerLinkActive="bg-[var(--color-nav-active)] text-[var(--color-nav-text)] border-r-2 border-[var(--color-primary)]"
            class="flex items-center gap-3 px-4 py-2.5 text-[var(--color-nav-text-muted)] hover:bg-[var(--color-nav-hover)] hover:text-[var(--color-nav-text)] transition-all text-sm font-medium border-r-2 border-transparent">
            <span class="material-icons text-xl">auto_stories</span>
            <span>مسار القرآن</span>
          </a>
          <a (click)="closeMenu()" routerLink="/english" routerLinkActive="bg-[var(--color-nav-active)] text-[var(--color-nav-text)] border-r-2 border-[var(--color-primary)]"
            class="flex items-center gap-3 px-4 py-2.5 text-[var(--color-nav-text-muted)] hover:bg-[var(--color-nav-hover)] hover:text-[var(--color-nav-text)] transition-all text-sm font-medium border-r-2 border-transparent">
            <span class="material-icons text-xl">translate</span>
            <span>مسار الإنجليزية</span>
          </a>

          <div class="pt-4 pb-1">
            <p class="px-4 text-[11px] font-bold text-white/20 tracking-widest mb-1">أدوات</p>
          </div>
          <a (click)="closeMenu()" routerLink="/reference" routerLinkActive="bg-[var(--color-nav-active)] text-[var(--color-nav-text)] border-r-2 border-[var(--color-primary)]"
            class="flex items-center gap-3 px-4 py-2.5 text-[var(--color-nav-text-muted)] hover:bg-[var(--color-nav-hover)] hover:text-[var(--color-nav-text)] transition-all text-sm font-medium border-r-2 border-transparent">
            <span class="material-icons text-xl">library_books</span>
            <span>المناهج التعليمية</span>
          </a>
          <a (click)="closeMenu()" routerLink="/stages" routerLinkActive="bg-[var(--color-nav-active)] text-[var(--color-nav-text)] border-r-2 border-[var(--color-primary)]"
            class="flex items-center gap-3 px-4 py-2.5 text-[var(--color-nav-text-muted)] hover:bg-[var(--color-nav-hover)] hover:text-[var(--color-nav-text)] transition-all text-sm font-medium border-r-2 border-transparent">
            <span class="material-icons text-xl">manage_accounts</span>
            <span>لوحة الإدارة</span>
          </a>
        </nav>
      </div>

      <div class="p-5 border-t border-white/[0.06]">
        <button
          (click)="theme.toggle()"
          class="flex items-center gap-3 w-full px-4 py-2.5 text-[var(--color-nav-text-muted)] hover:text-[var(--color-nav-text)] transition-all text-sm font-medium cursor-pointer mb-1 border-none">
          <span class="material-icons text-xl">{{ theme.isDark() ? 'light_mode' : 'dark_mode' }}</span>
          <span>{{ theme.isDark() ? 'الوضع الفاتح' : 'الوضع الداكن' }}</span>
        </button>
        <button
          (click)="logout()"
          class="flex items-center gap-3 w-full px-4 py-2.5 text-[var(--color-nav-text-muted)] hover:bg-[var(--color-rose-light)] hover:text-[var(--color-rose)] transition-all text-sm font-medium cursor-pointer mb-2 border-none">
          <span class="material-icons text-xl">logout</span>
          <span>تسجيل الخروج</span>
        </button>
        <div class="flex items-center gap-3 px-3 py-2 text-[var(--color-nav-text-muted)] text-xs">
          <span class="material-icons text-sm">verified</span>
          <span class="font-medium">v1.0 — متابع الحفظ</span>
        </div>
      </div>
    </aside>
  `,
})
export class SidebarComponent {
  state = inject(TrackerState);
  private router = inject(Router);
  private auth = inject(AuthService);
  theme = inject(ThemeService);
  mobileMenuOpen = signal(false);

  toggleMenu() {
    this.mobileMenuOpen.update((v) => !v);
  }

  closeMenu() {
    this.mobileMenuOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.closeMenu();
  }

  getAvatarEmoji = getAvatarEmoji;

  getStudentStageName(student: { id: string; name: string; xp: number }): string {
    const stage = this.state.getStudentStage({ xp: student.xp } as import('../../state').Student);
    return stage?.name || '';
  }

  getProgressLabel(): string {
    const url = this.router.url;
    if (url.includes('/quran')) return 'السور';
    if (url.includes('/english')) return 'المفردات';
    return 'الأحاديث';
  }

  getProgressValue(student: { memorizedHadithNumbers: number[]; memorizedSurahNumbers: number[]; memorizedEnglishUnits: number[] }): string {
    const url = this.router.url;
    if (url.includes('/quran')) {
      return `${student.memorizedSurahNumbers.length} / 114`;
    }
    if (url.includes('/english')) {
      const totalUnits = this.state.englishUnits().length;
      return `${student.memorizedEnglishUnits.length} / ${totalUnits}`;
    }
    return `${student.memorizedHadithNumbers.length} / ${this.state.hadiths().length}`;
  }

  isTracksMenuActive(): boolean {
    const url = this.router.url;
    return url.includes('/quran') || url.includes('/hadith') || url.includes('/english');
  }

  logout() {
    this.auth.logout();
  }
}

