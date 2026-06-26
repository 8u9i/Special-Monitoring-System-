import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TrackerState } from '../../state';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="w-full md:w-64 bg-[var(--color-nav)] flex flex-col justify-between shrink-0">
      <div class="p-5">
        <!-- App Identity -->
        <div class="flex items-center gap-3 mb-8 pb-6 border-b border-white/10">
          <div class="w-10 h-10 rounded-none bg-[var(--color-primary)] flex items-center justify-center">
            <span class="material-icons text-white text-xl">eco</span>
          </div>
          <div>
            <h1 class="font-inter text-lg font-bold text-white tracking-tight">يا إخوتي</h1>
            <p class="text-xs text-[var(--color-text-inverse-muted)] font-medium">متابع الحفظ التفاعلي</p>
          </div>
        </div>

        <!-- Selected Student Card -->
        @if (state.selectedStudent(); as student) {
        <div class="mb-6 p-4 rounded-none bg-white/5 border border-white/5">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-2 h-2 rounded-none bg-[var(--color-green)]"></div>
            <p class="text-[11px] text-[var(--color-text-inverse-muted)] font-semibold uppercase tracking-wider">الطالب المحدد</p>
          </div>
          <div class="flex items-center gap-2.5 mb-3">
            <span class="text-xl">{{ getAvatarEmoji(student.avatar) }}</span>
            <span class="font-bold text-white text-sm">{{ student.name }}</span>
          </div>
          <div class="flex items-center justify-between text-xs">
            <span class="text-[var(--color-text-inverse-muted)]">{{ getProgressLabel() }}:</span>
            <span class="font-semibold text-[var(--color-primary)]">{{ getProgressValue(student) }}</span>
          </div>
          <div class="flex items-center justify-between text-xs mt-2">
            <span class="text-[var(--color-text-inverse-muted)]">المرحلة:</span>
            <span class="font-semibold text-[var(--color-amber)]">{{ getStudentStageName(student) }}</span>
          </div>
        </div>
        }

        <!-- Navigation -->
        <nav class="space-y-1">
          <a routerLink="/dashboard" routerLinkActive="bg-white/10 text-white" [routerLinkActiveOptions]="{ exact: true }"
            class="flex items-center gap-3 px-4 py-2.5 rounded-none text-[var(--color-text-inverse-muted)] hover:bg-white/5 hover:text-white transition-all text-sm font-medium">
            <span class="material-icons text-xl">home</span>
            <span>الرئيسية</span>
          </a>

          <div class="pt-2 pb-1">
            <p class="px-4 text-[10px] font-bold text-[var(--color-text-inverse-muted)]/50 uppercase tracking-widest mb-1">مسارات التعلم</p>
          </div>
          <a routerLink="/hadith" routerLinkActive="bg-white/10 text-white"
            class="flex items-center gap-3 px-4 py-2.5 rounded-none text-[var(--color-text-inverse-muted)] hover:bg-white/5 hover:text-white transition-all text-sm font-medium">
            <span class="material-icons text-xl">menu_book</span>
            <span>مسار الأحاديث</span>
          </a>
          <a routerLink="/quran" routerLinkActive="bg-white/10 text-white"
            class="flex items-center gap-3 px-4 py-2.5 rounded-none text-[var(--color-text-inverse-muted)] hover:bg-white/5 hover:text-white transition-all text-sm font-medium">
            <span class="material-icons text-xl">auto_stories</span>
            <span>مسار القرآن</span>
          </a>
          <a routerLink="/english" routerLinkActive="bg-white/10 text-white"
            class="flex items-center gap-3 px-4 py-2.5 rounded-none text-[var(--color-text-inverse-muted)] hover:bg-white/5 hover:text-white transition-all text-sm font-medium">
            <span class="material-icons text-xl">translate</span>
            <span>مسار الإنجليزية</span>
          </a>

          <div class="pt-4 pb-1">
            <p class="px-4 text-[10px] font-bold text-[var(--color-text-inverse-muted)]/50 uppercase tracking-widest mb-1">أدوات</p>
          </div>
          <a routerLink="/reference" routerLinkActive="bg-white/10 text-white"
            class="flex items-center gap-3 px-4 py-2.5 rounded-none text-[var(--color-text-inverse-muted)] hover:bg-white/5 hover:text-white transition-all text-sm font-medium">
            <span class="material-icons text-xl">library_books</span>
            <span>المناهج التعليمية</span>
          </a>
          <a routerLink="/stages" routerLinkActive="bg-white/10 text-white"
            class="flex items-center gap-3 px-4 py-2.5 rounded-none text-[var(--color-text-inverse-muted)] hover:bg-white/5 hover:text-white transition-all text-sm font-medium">
            <span class="material-icons text-xl">manage_accounts</span>
            <span>لوحة الإدارة</span>
          </a>
        </nav>
      </div>

      <!-- Bottom Section -->
      <div class="p-5 border-t border-white/10">
        <div class="flex items-center gap-3 px-3 py-2 rounded-none bg-white/5 text-[var(--color-text-inverse-muted)] text-xs">
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

  avatarMap: Record<string, string> = {
    'avatar-leaf': '🌿',
    'avatar-mountain': '🏔️',
    'avatar-sun': '☀️',
    'avatar-flower': '🌸',
    'avatar-water': '💧',
    'avatar-shield': '🛡️',
  };

  getAvatarEmoji(key: string): string {
    return this.avatarMap[key] || '🌿';
  }

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

  getProgressValue(student: { memorizedHadithNumbers: number[]; memorizedSurahNumbers: number[]; memorizedEnglishUnits: string[]; memorizedVocabWords: string[] }): string {
    const url = this.router.url;
    if (url.includes('/quran')) {
      return `${student.memorizedSurahNumbers.length} / 114`;
    }
    if (url.includes('/english')) {
      const totalVocab = this.state.vocabLists().reduce((sum, l) => sum + l.words.length, 0);
      const done = (student.memorizedVocabWords || []).length;
      return `${done} / ${totalVocab}`;
    }
    return `${student.memorizedHadithNumbers.length} / ${this.state.hadiths().length}`;
  }

  isTracksMenuActive(): boolean {
    const url = this.router.url;
    return url.includes('/quran') || url.includes('/hadith') || url.includes('/english');
  }
}
