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
    <div class="space-y-6">
      <app-student-carousel />

      @if (state.selectedStudent(); as qStudent) {
      <div class="panel overflow-hidden">
        <div class="p-5 flex flex-col sm:flex-row items-center gap-5">
          <div class="relative w-24 h-24 shrink-0">
            <svg class="w-24 h-24 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-border-light)" stroke-width="8" />
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-primary)" stroke-width="8"
                stroke-linecap="round"
                [attr.stroke-dasharray]="326.73"
                [attr.stroke-dashoffset]="326.73 * (1 - state.quranProgress().percentage / 100)"
                class="transition-all duration-1000 ease-out" />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-xl font-bold text-[var(--color-primary)]">{{ state.quranProgress().percentage }}%</span>
            </div>
          </div>
          <div class="flex-1 text-center sm:text-right">
            <h3 class="font-tajawal text-base font-bold text-[var(--color-text-primary)] mb-1">تقدم {{ qStudent.name }} في حفظ القرآن</h3>
            <p class="text-sm text-[var(--color-text-secondary)] mb-3">
              حفظ <span class="font-bold text-[var(--color-primary)]">{{ state.quranProgress().totalMemorized }}</span> من 114 سورة
            </p>
            <div class="progress-bar h-2.5">
              <div class="progress-fill-green" [style.width.%]="state.quranProgress().percentage"></div>
            </div>
            <div class="flex items-center justify-between mt-1.5 text-xs text-[var(--color-text-tertiary)]">
              <span>0</span>
              <span class="font-semibold text-[var(--color-text-secondary)]">{{ state.quranProgress().totalMemorized }} / 114</span>
              <span>114</span>
            </div>
          </div>
        </div>
      </div>
      }

      @if (state.selectedStudent(); as student) {
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <app-student-stage-card [student]="student" />

        <div class="space-y-4 lg:col-span-2">
          <div class="panel p-6">
            <div class="panel-header">
              <h3 class="panel-title">
                <span class="panel-title-icon">mosque</span>
                مسار حفظ السور
              </h3>
              <p class="text-xs text-[var(--color-text-secondary)]">اضغط على سورة لإدارة صفحاتها</p>
            </div>

            <div class="space-y-1 max-h-[600px] overflow-y-auto">
              @for (surah of allSurahs; track surah.number) {
              @let isExpanded = expandedSurah()?.number === surah.number;
              @let surahStatus = getSurahStatus(student, surah);
              <div class="border transition-all"
                [class.border-[var(--color-primary)]]="isExpanded"
                [class.border-[var(--color-border-light)]]="!isExpanded">
                <button (click)="toggleSurah(surah)"
                  class="w-full flex items-center gap-3 px-4 py-3 text-right cursor-pointer transition-colors border-none"
                  [class.bg-[var(--color-primary-light)]]="isExpanded"
                  [class.hover:bg-[var(--color-canvas)]]="!isExpanded"
                  [attr.aria-expanded]="isExpanded"
                  [attr.aria-controls]="'surah-content-' + surah.number"
                  [attr.id]="'surah-btn-' + surah.number">
                  <span class="badge-number transition-all"
                    [ngClass]="{
                      'badge-number-memorized': surahStatus === 'memorized',
                      'badge-number-review': surahStatus === 'review',
                      'badge-number-none bg-[var(--color-canvas)] border border-[var(--color-border)]': surahStatus === 'none'
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
                  <span class="text-[11px] font-semibold flex-shrink-0"
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
                <div class="border-t border-[var(--color-border-light)] p-4 bg-[var(--color-canvas)]" [attr.id]="'surah-content-' + surah.number" role="region" [attr.aria-labelledby]="'surah-btn-' + surah.number">
                  @if (surah.pagesCount) {
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2">
                      <button (click)="onMarkAllPages(student.id, surah)"
                        class="btn btn-sm"
                        [class]="countMemorizedPages(student, surah) === surah.pagesCount
                          ? 'btn-primary'
                          : 'btn-outline'">
                        <span class="material-icons text-xs">check_circle_outline</span>
                        حفظ الكل
                      </button>
                      @if (countMemorizedPages(student, surah) > 0) {
                      <button (click)="onClearAllPages(student.id, surah)"
                        class="btn btn-sm border-[var(--color-rose-light)] bg-[var(--color-surface)] text-[var(--color-rose)] hover:bg-[var(--color-rose-light)]">
                        <span class="material-icons text-xs">restart_alt</span>
                        مسح
                      </button>
                      }
                    </div>
                    <span class="text-[11px] font-semibold text-[var(--color-text-secondary)]">
                      {{ countMemorizedPages(student, surah) }} / {{ surah.pagesCount }} صفحة
                    </span>
                  </div>
                  <div class="flex flex-wrap gap-1.5">
                    @for (i of [].constructor(surah.pagesCount); track $index) {
                    @let pageId = surah.number + '-' + ($index + 1);
                    @let isMemorized = (student.memorizedSurahPages || []).includes(pageId);
                    <button (click)="state.toggleSurahPageStatus(student.id, surah.number, $index + 1, isMemorized ? 'none' : 'memorized')"
                      class="w-9 h-9 border flex items-center justify-center font-bold text-[11px] transition-all cursor-pointer"
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
                        ? 'btn btn-primary btn-sm'
                        : 'btn btn-outline btn-sm'">
                      محفوظ
                    </button>
                    <button (click)="state.toggleSurahStatus(student.id, surah.number, 'review')"
                      [class]="simpleStatus === 'review'
                        ? 'btn btn-sm bg-[var(--color-amber)] text-[var(--color-text-primary)]'
                        : 'btn btn-outline btn-sm'">
                      مراجعة
                    </button>
                    <button (click)="state.toggleSurahStatus(student.id, surah.number, 'none')"
                      [class]="simpleStatus === 'none'
                        ? 'btn btn-sm bg-[var(--color-border)] text-[var(--color-text-secondary)]'
                        : 'btn btn-outline btn-sm'">
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
