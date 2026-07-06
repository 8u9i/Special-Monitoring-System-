import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackerState, Student } from '../../state';
import { Hadith } from '../../hadith-data';
import { ToastService } from '../../shared/services/toast.service';
import { CelebrationService } from '../../shared/services/celebration.service';
import { StudentCarouselComponent } from '../../shared/containers/student-carousel.component';
import { StudentStageCardComponent } from '../../shared/containers/student-stage-card.component';

@Component({
  selector: 'app-hadith-trail',
  imports: [CommonModule, StudentCarouselComponent, StudentStageCardComponent],
  template: `
    <div class="space-y-6">
      <app-student-carousel />

      @if (state.selectedStudent(); as student) {
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <app-student-stage-card [student]="student" />

        <div class="space-y-4 lg:col-span-2">
          <div class="panel p-6">
            <div class="panel-header">
              <h3 class="panel-title">
                <span class="panel-title-icon">alt_route</span>
                مسار الأحاديث
              </h3>
              <p class="text-xs text-[var(--color-text-secondary)]">اضغط على الباب لعرض الأحاديث</p>
            </div>

            <div class="space-y-1 max-h-[600px] overflow-y-auto">
              @for (group of groupedHadiths(); track group.category) {
              @let isCategoryExpanded = expandedCategory() === group.category;
              <div class="border transition-all"
                [class.border-[var(--color-primary)]]="isCategoryExpanded"
                [class.border-[var(--color-border-light)]]="!isCategoryExpanded">
                <button (click)="toggleCategory(group.category)"
                  class="w-full flex items-center gap-3 px-4 py-3 text-right cursor-pointer transition-colors border-none"
                  [class.bg-[var(--color-primary-light)]]="isCategoryExpanded"
                  [class.hover:bg-[var(--color-canvas)]]="!isCategoryExpanded"
                  [attr.aria-expanded]="isCategoryExpanded"
                  [attr.aria-controls]="'cat-content-' + group.category"
                  [attr.id]="'cat-btn-' + group.category">
                  <span class="material-icons text-[var(--color-primary)] text-sm">folder</span>
                  <span class="font-bold text-sm flex-1 text-right text-[var(--color-text-primary)]">
                    {{ group.category }}
                  </span>
                  <span class="tag tag-primary">{{ group.hadiths.length }}</span>
                  <span class="material-icons text-sm text-[var(--color-text-tertiary)] transition-transform flex-shrink-0"
                    [class.rotate-180]="isCategoryExpanded">expand_more</span>
                </button>

                @if (isCategoryExpanded) {
                <div class="border-t border-[var(--color-border-light)] bg-[var(--color-canvas)]" [attr.id]="'cat-content-' + group.category" role="region" [attr.aria-labelledby]="'cat-btn-' + group.category">
                  @for (hadith of group.hadiths; track hadith.number; let idx = $index) {
                  @let isExpanded = expandedHadithNumber() === hadith.number;
                  @let hadithStatus = getHadithStatus(student, hadith.number);
                  <div class="border-b border-[var(--color-border-light)] last:border-b-0">
                    <button (click)="toggleHadith(hadith.number)"
                      class="w-full flex items-center gap-3 px-4 py-3 text-right cursor-pointer transition-colors border-none"
                      [class.bg-[var(--color-surface)]]="isExpanded"
                      [class.hover:bg-[var(--color-surface)]]="!isExpanded"
                      [attr.aria-expanded]="isExpanded"
                      [attr.aria-controls]="'hadith-content-' + hadith.number">
                      <span class="badge-number transition-all"
                        [ngClass]="{
                          'badge-number-memorized': hadithStatus === 'memorized',
                          'badge-number-review': hadithStatus === 'review',
                          'badge-number-none': hadithStatus === 'none'
                        }">
                        {{ idx + 1 }}
                      </span>
                      <span class="font-bold text-sm flex-1 truncate text-right"
                        [class.text-[var(--color-text-primary)]]="hadithStatus !== 'none'"
                        [class.text-[var(--color-text-secondary)]]="hadithStatus === 'none'">
                        الحديث {{ idx + 1 }}
                      </span>
                      <span class="material-icons text-sm text-[var(--color-text-tertiary)] transition-transform flex-shrink-0"
                        [class.rotate-180]="isExpanded">expand_more</span>
                    </button>

                    @if (isExpanded) {
                    <div class="border-t border-[var(--color-border-light)] p-4 bg-[var(--color-surface)]" [attr.id]="'hadith-content-' + hadith.number" role="region">
                      <div class="p-4 bg-[var(--color-amber-light)] border text-center mb-4" [style.border-color]="'color-mix(in srgb, var(--color-amber) 20%, transparent)'">
                        <p class="font-amiri text-base font-bold text-[var(--color-text-primary)] leading-relaxed select-all">
                          "{{ hadith.text }}"
                        </p>
                      </div>

                      <p class="text-xs text-[var(--color-text-secondary)] mb-3">
                        <span class="font-semibold">الراوي:</span> {{ hadith.reference }}
                      </p>

                      <div class="p-3 bg-[var(--color-canvas)] border border-[var(--color-border-light)] mb-4">
                        <span class="text-xs text-[var(--color-primary)] font-bold flex items-center gap-1 mb-1">
                          <span class="material-icons text-sm">spa</span>
                          المعنى المبسط:
                        </span>
                        <p class="text-xs text-[var(--color-text-secondary)] leading-relaxed">{{ hadith.explanation }}</p>
                      </div>

                      <div class="pt-3 border-t border-[var(--color-border-light)]">
                        <p class="text-xs text-[var(--color-text-secondary)] font-semibold text-center mb-2">
                          تحديث حالة الحديث لـ {{ student.name }}:
                        </p>
                        <div class="grid grid-cols-3 gap-2">
                          <button (click)="setHadithStatus(student.id, hadith.number, 'memorized')"
                            [class]="hadithStatus === 'memorized'
                              ? 'btn btn-primary btn-sm flex items-center justify-center gap-1.5'
                              : 'btn btn-outline btn-sm flex items-center justify-center gap-1.5'">
                            <span class="material-icons text-sm">check_circle</span>
                            تم الحفظ
                          </button>
                          <button (click)="setHadithStatus(student.id, hadith.number, 'review')"
                            [class]="hadithStatus === 'review'
                              ? 'btn btn-sm flex items-center justify-center gap-1.5 bg-[var(--color-amber)] text-[var(--color-text-primary)]'
                              : 'btn btn-outline btn-sm flex items-center justify-center gap-1.5'">
                            <span class="material-icons text-sm">menu_book</span>
                            قيد المراجعة
                          </button>
                          <button (click)="setHadithStatus(student.id, hadith.number, 'none')"
                            [class]="hadithStatus === 'none'
                              ? 'btn btn-sm flex items-center justify-center gap-1.5 bg-[var(--color-border)] text-[var(--color-text-secondary)]'
                              : 'btn btn-outline btn-sm flex items-center justify-center gap-1.5'">
                            <span class="material-icons text-sm">restart_alt</span>
                            إعادة ضبط
                          </button>
                        </div>
                      </div>
                    </div>
                    }
                  </div>
                  }
                </div>
                }
              </div>
              } @empty {
              <div class="empty-state">
                <span class="empty-state-icon">menu_book</span>
                <p class="empty-state-text">لا توجد أحاديث مضافة بعد</p>
                <p class="text-xs text-[var(--color-text-tertiary)] mt-1">أضف أحاديث من صفحة المناهج التعليمية</p>
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
export class HadithTrailComponent {
  state = inject(TrackerState);
  private toast = inject(ToastService);
  private celebration = inject(CelebrationService);

  expandedCategory = signal<string | null>(null);
  expandedHadithNumber = signal<number | null>(null);

  groupedHadiths = computed(() => {
    const map = new Map<string, Hadith[]>();
    for (const h of this.state.hadiths()) {
      const arr = map.get(h.category) || [];
      arr.push(h);
      map.set(h.category, arr);
    }
    return Array.from(map.entries()).map(([category, hadiths]) => ({ category, hadiths }));
  });

  toggleCategory(category: string) {
    this.expandedCategory.set(this.expandedCategory() === category ? null : category);
    this.expandedHadithNumber.set(null);
  }

  toggleHadith(number: number) {
    this.expandedHadithNumber.set(this.expandedHadithNumber() === number ? null : number);
  }

  getHadithStatus(student: Student | null, hadithNum: number): 'memorized' | 'review' | 'none' {
    if (!student) return 'none';
    if (student.memorizedHadithNumbers.includes(hadithNum)) return 'memorized';
    if (student.reviewHadithNumbers.includes(hadithNum)) return 'review';
    return 'none';
  }

  setHadithStatus(studentId: string, hadithNum: number, status: 'memorized' | 'review' | 'none') {
    const student = this.state.students().find((s) => s.id === studentId);
    if (!student) return;
    const prevStage = this.state.getStudentStage(student);
    this.state.toggleHadithStatus(studentId, hadithNum, status);

    const updatedStudent = this.state.students().find((s) => s.id === studentId);
    if (updatedStudent) {
      const newStage = this.state.getStudentStage(updatedStudent);
      if (newStage.level > prevStage.level) {
        this.celebration.trigger(updatedStudent, newStage);
      } else {
        const statusMsg = status === 'memorized' ? 'تم الحفظ بنجاح!' : status === 'review' ? 'تم النقل للمراجعة' : 'تم إعادة التعيين';
        this.toast.show(`${updatedStudent.name}: ${statusMsg}`);
      }
    }
  }
}
