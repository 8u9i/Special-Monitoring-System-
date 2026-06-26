import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackerState, QURAN_SURAHS, Student } from '../../state';
import { StudentCarouselComponent } from '../../shared/containers/student-carousel.component';
import { StudentStageCardComponent } from '../../shared/containers/student-stage-card.component';

interface SurahInfo {
  number: number;
  name: string;
  pagesCount?: number;
}

@Component({
  selector: 'app-quran-trail',
  imports: [CommonModule, StudentCarouselComponent, StudentStageCardComponent],
  template: `
    <div class="space-y-8">
      <app-student-carousel />

      @if (state.selectedStudent(); as student) {
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <app-student-stage-card [student]="student" />

        <div class="space-y-6 lg:col-span-2">
          <div class="bg-[var(--color-surface)] rounded-none p-6 border border-[var(--color-border)]">
            <div class="flex items-center justify-between mb-5 pb-4 border-b border-[var(--color-border-light)]">
              <h3 class="font-inter text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                <span class="material-icons text-[var(--color-primary)]">mosque</span>
                مسار حفظ السور
              </h3>
              <p class="text-xs text-[var(--color-text-secondary)]">اضغط على سورة لإدارة صفحاتها</p>
            </div>

            <div class="space-y-1 max-h-[600px] overflow-y-auto pl-1">
              @for (surah of allSurahs; track surah.number) {
              @let isExpanded = expandedSurah()?.number === surah.number;
              @let surahStatus = getSurahStatus(student, surah);
              <div class="rounded-none border transition-all"
                [class.border-[var(--color-primary)]]="isExpanded"
                [class.border-[var(--color-border-light)]]="!isExpanded">
                <button (click)="toggleSurah(surah)"
                  class="w-full flex items-center gap-3 px-4 py-3 text-right cursor-pointer transition-colors border-none"
                  [class.bg-[var(--color-primary-light)]]="isExpanded"
                  [class.hover:bg-[var(--color-canvas)]]="!isExpanded">
                  <span class="w-7 h-7 rounded-none flex items-center justify-center text-[10px] font-bold flex-shrink-0 transition-all"
                    [ngClass]="{
                      'bg-[var(--color-primary)] text-white': surahStatus === 'memorized',
                      'bg-[var(--color-amber)] text-[var(--color-text-primary)]': surahStatus === 'review',
                      'bg-[var(--color-canvas)] text-[var(--color-text-tertiary)] border border-[var(--color-border)]': surahStatus === 'none'
                    }">
                    {{ surah.number }}
                  </span>
                  <span class="font-bold text-sm flex-1 truncate"
                    [class.text-[var(--color-text-primary)]]="surahStatus !== 'none'"
                    [class.text-[var(--color-text-secondary)]]="surahStatus === 'none'">
                    {{ surah.name }}
                  </span>
                  @if (surah.pagesCount) {
                  @let memorizedPagesCount = countMemorizedPages(student, surah);
                  <span class="text-[10px] font-semibold flex-shrink-0"
                    [class.text-[var(--color-primary)]]="memorizedPagesCount > 0 && memorizedPagesCount < surah.pagesCount"
                    [class.text-[var(--color-green)]]="memorizedPagesCount === surah.pagesCount"
                    [class.text-[var(--color-text-tertiary)]]="memorizedPagesCount === 0">
                    {{ memorizedPagesCount }}/{{ surah.pagesCount }}
                  </span>
                  }
                  <span class="material-icons text-sm text-[var(--color-text-tertiary)] transition-transform flex-shrink-0"
                    [class.rotate-180]="isExpanded">expand_more</span>
                </button>

                @if (isExpanded) {
                <div class="border-t border-[var(--color-border-light)] p-4 bg-[var(--color-canvas)]">
                  @if (surah.pagesCount) {
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2">
                      <button (click)="onMarkAllPages(student.id, surah)"
                        class="px-3 py-1.5 text-[10px] font-semibold rounded-none border transition-all cursor-pointer"
                        [class]="countMemorizedPages(student, surah) === surah.pagesCount
                          ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                          : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-primary)]'">
                        <span class="material-icons text-xs align-middle">check_circle_outline</span>
                        حفظ الكل
                      </button>
                      @if (countMemorizedPages(student, surah) > 0) {
                      <button (click)="onClearAllPages(student.id, surah)"
                        class="px-3 py-1.5 text-[10px] font-semibold rounded-none border border-gray-200 bg-[var(--color-surface)] text-red-500 hover:bg-red-50 transition-all cursor-pointer">
                        <span class="material-icons text-xs align-middle">restart_alt</span>
                        مسح
                      </button>
                      }
                    </div>
                    <span class="text-[10px] font-semibold text-[var(--color-text-secondary)]">
                      {{ countMemorizedPages(student, surah) }} / {{ surah.pagesCount }} صفحة
                    </span>
                  </div>
                  <div class="flex flex-wrap gap-1.5">
                    @for (i of [].constructor(surah.pagesCount); track $index) {
                    @let pageId = surah.number + '-' + ($index + 1);
                    @let isMemorized = (student.memorizedSurahPages || []).includes(pageId);
                    <button (click)="state.toggleSurahPageStatus(student.id, surah.number, $index + 1, isMemorized ? 'none' : 'memorized')"
                      class="w-9 h-9 rounded-none border flex items-center justify-center font-bold text-[10px] transition-all cursor-pointer"
                      [ngClass]="{
                        'bg-[var(--color-primary)] text-white border-[var(--color-primary)]': isMemorized,
                        'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-primary)]': !isMemorized
                      }">
                      {{ $index + 1 }}
                    </button>
                    }
                  </div>
                  } @else {
                  @let simpleStatus = student.memorizedSurahNumbers.includes(surah.number) ? 'memorized' : (student.reviewSurahNumbers.includes(surah.number) ? 'review' : 'none');
                  <div class="flex items-center gap-2 justify-center py-2">
                    <span class="text-xs text-[var(--color-text-secondary)] font-medium ml-2">تحديث حالة السورة:</span>
                    <button (click)="state.toggleSurahStatus(student.id, surah.number, 'memorized')"
                      [class]="simpleStatus === 'memorized'
                        ? 'px-4 py-2 rounded-none bg-[var(--color-primary)] text-white font-semibold text-xs'
                        : 'px-4 py-2 rounded-none bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] text-xs cursor-pointer hover:border-[var(--color-primary)]'">
                      محفوظ
                    </button>
                    <button (click)="state.toggleSurahStatus(student.id, surah.number, 'review')"
                      [class]="simpleStatus === 'review'
                        ? 'px-4 py-2 rounded-none bg-[var(--color-amber)] text-[var(--color-text-primary)] font-semibold text-xs'
                        : 'px-4 py-2 rounded-none bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] text-xs cursor-pointer hover:border-[var(--color-amber)]'">
                      مراجعة
                    </button>
                    <button (click)="state.toggleSurahStatus(student.id, surah.number, 'none')"
                      [class]="simpleStatus === 'none'
                        ? 'px-4 py-2 rounded-none bg-[var(--color-border)] text-[var(--color-text-secondary)] font-semibold text-xs'
                        : 'px-4 py-2 rounded-none bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] text-xs cursor-pointer hover:border-[var(--color-text-tertiary)]'">
                      لم يبدأ
                    </button>
                  </div>
                  }
                </div>
                }
              </div>
              }
            </div>
          </div>
        </div>
      </div>
      }
    </div>
  `,
})
export class QuranTrailComponent {
  state = inject(TrackerState);
  allSurahs = QURAN_SURAHS;
  expandedSurah = signal<SurahInfo | null>(null);

  toggleSurah(surah: SurahInfo) {
    this.expandedSurah.set(this.expandedSurah()?.number === surah.number ? null : surah);
  }

  getSurahStatus(student: Student, surah: SurahInfo): 'memorized' | 'review' | 'none' {
    if (!surah.pagesCount) {
      if (student.memorizedSurahNumbers.includes(surah.number)) return 'memorized';
      if (student.reviewSurahNumbers.includes(surah.number)) return 'review';
      return 'none';
    }
    const total = surah.pagesCount;
    const memorized = this.countMemorizedPages(student, surah);
    if (memorized === total) return 'memorized';
    if (memorized > 0) return 'review';
    return 'none';
  }

  countMemorizedPages(student: Student, surah: SurahInfo): number {
    if (!surah.pagesCount) return 0;
    const pages = student.memorizedSurahPages || [];
    let count = 0;
    for (let i = 1; i <= surah.pagesCount; i++) {
      if (pages.includes(surah.number + '-' + i)) count++;
    }
    return count;
  }

  onMarkAllPages(studentId: string, surah: SurahInfo) {
    if (!surah.pagesCount) return;
    this.state.markAllSurahPages(studentId, surah.number, surah.pagesCount);
  }

  onClearAllPages(studentId: string, surah: SurahInfo) {
    if (!surah.pagesCount) return;
    this.state.clearAllSurahPages(studentId, surah.number, surah.pagesCount);
  }
}
