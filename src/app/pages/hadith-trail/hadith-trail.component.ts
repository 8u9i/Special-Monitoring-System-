import { Component, inject, signal } from '@angular/core';
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
    <div class="space-y-8">
      <app-student-carousel />

      @if (state.selectedStudent(); as student) {
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <app-student-stage-card [student]="student" />

        <div class="space-y-6 lg:col-span-2">
          <div class="bg-[var(--color-surface)] rounded-none p-6 border border-[var(--color-border)]">
            <div class="flex items-center justify-between mb-5 pb-4 border-b border-[var(--color-border-light)]">
              <h3 class="font-inter text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                <span class="material-icons text-[var(--color-primary)]">alt_route</span>
                مسار الأحاديث
              </h3>
              <p class="text-xs text-[var(--color-text-secondary)]">اضغط على الحديث لإدارة حالته</p>
            </div>

            <div class="space-y-1 max-h-[600px] overflow-y-auto pl-1">
              @for (hadith of allHadiths; track hadith.number) {
              @let isExpanded = expandedHadithNumber() === hadith.number;
              @let hadithStatus = getHadithStatus(student, hadith.number);
              <div class="rounded-none border transition-all"
                [class.border-[var(--color-primary)]]="isExpanded"
                [class.border-[var(--color-border-light)]]="!isExpanded">
                <button (click)="toggleHadith(hadith.number)"
                  class="w-full flex items-center gap-3 px-4 py-3 text-right cursor-pointer transition-colors border-none"
                  [class.bg-[var(--color-primary-light)]]="isExpanded"
                  [class.hover:bg-[var(--color-canvas)]]="!isExpanded">
                  <span class="w-7 h-7 rounded-none flex items-center justify-center text-[10px] font-bold flex-shrink-0 transition-all"
                    [ngClass]="{
                      'bg-[var(--color-primary)] text-white': hadithStatus === 'memorized',
                      'bg-[var(--color-amber)] text-[var(--color-text-primary)]': hadithStatus === 'review',
                      'bg-[var(--color-canvas)] text-[var(--color-text-tertiary)] border border-[var(--color-border)]': hadithStatus === 'none'
                    }">
                    {{ hadith.number }}
                  </span>
                  <span class="font-bold text-sm flex-1 truncate text-right"
                    [class.text-[var(--color-text-primary)]]="hadithStatus !== 'none'"
                    [class.text-[var(--color-text-secondary)]]="hadithStatus === 'none'">
                    {{ hadith.title }}
                  </span>
                  <span class="text-[10px] font-semibold text-[var(--color-text-tertiary)] hidden sm:inline ml-2">{{ hadith.category }}</span>
                  <span class="material-icons text-sm text-[var(--color-text-tertiary)] transition-transform flex-shrink-0"
                    [class.rotate-180]="isExpanded">expand_more</span>
                </button>

                @if (isExpanded) {
                <div class="border-t border-[var(--color-border-light)] p-4 bg-[var(--color-canvas)]">
                  <div class="p-4 rounded-none bg-[var(--color-amber-light)] border border-[var(--color-amber)]/20 text-center mb-4">
                    <p class="font-amiri text-base font-bold text-[var(--color-text-primary)] leading-relaxed select-all">
                      "{{ hadith.text }}"
                    </p>
                  </div>

                  <p class="text-xs text-[var(--color-text-secondary)] mb-3">
                    <span class="font-semibold">الراوي:</span> {{ hadith.reference }}
                  </p>

                  <div class="p-3 rounded-none bg-[var(--color-surface)] border border-[var(--color-border-light)] mb-4">
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
                          ? 'flex items-center justify-center gap-1.5 px-3 py-2 rounded-none bg-[var(--color-primary)] text-white font-semibold cursor-pointer text-xs'
                          : 'flex items-center justify-center gap-1.5 px-3 py-2 rounded-none bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] transition-all cursor-pointer text-xs'">
                        <span class="material-icons text-sm">check_circle</span>
                        تم الحفظ
                      </button>
                      <button (click)="setHadithStatus(student.id, hadith.number, 'review')"
                        [class]="hadithStatus === 'review'
                          ? 'flex items-center justify-center gap-1.5 px-3 py-2 rounded-none bg-[var(--color-amber)] text-[var(--color-text-primary)] font-semibold cursor-pointer text-xs'
                          : 'flex items-center justify-center gap-1.5 px-3 py-2 rounded-none bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-amber)] transition-all cursor-pointer text-xs'">
                        <span class="material-icons text-sm">menu_book</span>
                        قيد المراجعة
                      </button>
                      <button (click)="setHadithStatus(student.id, hadith.number, 'none')"
                        [class]="hadithStatus === 'none'
                          ? 'flex items-center justify-center gap-1.5 px-3 py-2 rounded-none bg-[var(--color-border)] text-[var(--color-text-secondary)] font-semibold cursor-pointer text-xs'
                          : 'flex items-center justify-center gap-1.5 px-3 py-2 rounded-none bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-tertiary)] hover:border-[var(--color-text-tertiary)] transition-all cursor-pointer text-xs'">
                        <span class="material-icons text-sm">restart_alt</span>
                        إعادة ضبط
                      </button>
                    </div>
                  </div>
                </div>
                }
              </div>
              } @empty {
              <div class="text-center py-10 rounded-none bg-[var(--color-canvas)] border border-[var(--color-border-light)]">
                <span class="material-icons text-4xl text-[var(--color-text-tertiary)]">menu_book</span>
                <p class="text-[var(--color-text-secondary)] mt-2 font-semibold text-sm">لا توجد أحاديث مضافة بعد</p>
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

  expandedHadithNumber = signal<number | null>(null);

  get allHadiths(): Hadith[] { return this.state.hadiths(); }

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
