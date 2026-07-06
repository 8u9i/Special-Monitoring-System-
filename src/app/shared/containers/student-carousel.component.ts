import { Component, inject } from '@angular/core';
import { TrackerState } from '../../state';
import { Router } from '@angular/router';
import { getAvatarEmoji } from '../constants/avatars';

import { AppIconComponent } from '../../shared/components/app-icon/app-icon.component';

@Component({
  selector: 'app-student-carousel',
    imports: [AppIconComponent],
  template: `
    <div class="panel p-5">
      <h3 class="font-tajawal text-sm font-bold mb-3 text-[var(--color-text-secondary)] flex items-center gap-2">
        <app-icon name="psychology" [size]="18"></app-icon>
        اختر الطالب
      </h3>
      <div class="flex flex-wrap gap-2">
        @for (student of state.students(); track student.id) {
        @let isSelected = state.selectedStudentId() === student.id;
        @let progress = getRouteProgress(student);
        <button (click)="state.selectedStudentId.set(student.id)"
          [class]="isSelected
            ? 'flex items-center gap-2.5 px-4 py-2.5 bg-[var(--color-primary)] text-white font-semibold transition-all cursor-pointer text-sm'
            : 'flex items-center gap-2.5 px-4 py-2.5 bg-[var(--color-canvas)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all cursor-pointer text-sm'"
          [attr.aria-pressed]="isSelected">
          <span class="text-lg leading-none select-none">{{ getAvatarEmoji(student.avatar) }}</span>
          <div class="text-right">
            <p class="font-bold text-sm">{{ student.name }}</p>
            <p class="text-[11px] opacity-70 font-medium">
              {{ progress.done }} / {{ progress.total }}
            </p>
          </div>
        </button>
        } @empty {
        <div class="w-full empty-state py-6 mx-0">
          <span class="empty-state-icon">group_off</span>
          <p class="empty-state-text">يرجى تسجيل الطلاب أولاً</p>
        </div>
        }
      </div>
    </div>
  `,
})
export class StudentCarouselComponent {
  state = inject(TrackerState);
  private router = inject(Router);

  getAvatarEmoji = getAvatarEmoji;

  getRouteProgress(student: { memorizedHadithNumbers: number[]; memorizedSurahNumbers: number[]; memorizedEnglishUnits: number[] }) {
    const url = this.router.url;
    if (url.includes('/quran')) {
      return { done: student.memorizedSurahNumbers.length, total: 114 };
    }
    if (url.includes('/english')) {
      const totalUnits = this.state.englishUnits().length;
      return { done: student.memorizedEnglishUnits.length, total: totalUnits };
    }
    // Default: hadith or any other page
    return { done: student.memorizedHadithNumbers.length, total: this.state.hadiths().length };
  }
}
