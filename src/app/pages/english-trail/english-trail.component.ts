import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackerState, Student, EnglishUnitWithWords } from '../../state';
import { StudentCarouselComponent } from '../../shared/containers/student-carousel.component';
import { StudentStageCardComponent } from '../../shared/containers/student-stage-card.component';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-english-trail',
  imports: [CommonModule, StudentCarouselComponent, StudentStageCardComponent],
  template: `
    <div class="space-y-8" style="font-family: 'Cause', sans-serif;">
      <app-student-carousel />

      @if (state.selectedStudent(); as student) {
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <app-student-stage-card [student]="student" />

        <div class="space-y-6 lg:col-span-2">
          <div class="bg-[var(--color-surface)] rounded-none p-6 border border-[var(--color-border)]">
            <div class="flex items-center justify-between mb-5 pb-4 border-b border-[var(--color-border-light)]">
              <h3 class="font-inter text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                <span class="material-icons text-[var(--color-primary)]">language</span>
                الوحدات الإنجليزية
              </h3>
              <div class="flex flex-col items-end gap-1 text-xs font-medium text-[var(--color-text-secondary)]">
                <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-none bg-[var(--color-primary)]"></span> محفوظ</span>
                <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-none bg-[var(--color-amber)]"></span> مراجعة</span>
                <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-none bg-[var(--color-border)]"></span> لم يبدأ</span>
              </div>
            </div>

            <!-- Units Grid -->
            <div class="grid grid-cols-4 sm:grid-cols-6 gap-3">
              @for (unit of state.englishUnits(); track unit.unitNumber) {
              @let unitStatus = getUnitStatus(student, unit.unitNumber);
              <button (click)="onUnitClick(unit)"
                class="aspect-square rounded-none border flex flex-col items-center justify-center transition-all hover:scale-105 cursor-pointer"
                [class.bg-[var(--color-surface)]]="unitStatus === 'none'"
                [class.bg-emerald-50]="unitStatus === 'memorized'"
                [class.bg-[var(--color-amber-light)]]="unitStatus === 'review'"
                [class.border-[var(--color-primary)]]="unitStatus === 'memorized' || selectedUnit()?.unitNumber === unit.unitNumber"
                [class.border-[var(--color-amber)]]="unitStatus === 'review'"
                [class.border-[var(--color-border-light)]]="unitStatus === 'none' && selectedUnit()?.unitNumber !== unit.unitNumber"
                [class.bg-[var(--color-primary-light)]]="selectedUnit()?.unitNumber === unit.unitNumber"
                title="Unit {{ unit.unitNumber }}">
                <span class="material-icons text-xl"
                  [class.text-[var(--color-primary)]]="unitStatus !== 'review'"
                  [class.text-[var(--color-amber)]]="unitStatus === 'review'">translate</span>
                <span class="text-[9px] font-semibold mt-1 leading-tight px-1 text-center line-clamp-2"
                  [class.text-[var(--color-text-secondary)]]="unitStatus === 'none'"
                  [class.text-[var(--color-primary-dark)]]="unitStatus === 'memorized'"
                  [class.text-[var(--color-text-primary)]]="unitStatus === 'review'">{{ unit.unitNumber }}</span>
                <span class="text-[8px] font-bold mt-0.5"
                  [class.text-[var(--color-text-tertiary)]]="unitStatus === 'none'"
                  [class.text-[var(--color-primary)]]="unitStatus === 'memorized'"
                  [class.text-[var(--color-amber)]]="unitStatus === 'review'">{{ unit.words.length }} كلمة</span>
              </button>
              } @empty {
              <div class="col-span-full text-center py-8 rounded-none bg-[var(--color-canvas)] border border-[var(--color-border-light)]">
                <span class="material-icons text-3xl text-[var(--color-text-tertiary)]">translate</span>
                <p class="text-[var(--color-text-secondary)] font-medium mt-2 text-sm">لا توجد وحدات إنجليزية بعد</p>
              </div>
              }
            </div>
          </div>

          <!-- Unit Detail -->
          @if (selectedUnit(); as unit) {
          <div class="bg-[var(--color-surface)] rounded-none p-6 border border-[var(--color-border)]">
            <div class="flex items-center justify-between mb-4 pb-3 border-b border-[var(--color-border-light)]">
              <div class="flex-1">
                <h4 class="font-inter text-lg font-bold text-[var(--color-text-primary)]">الوحدة {{ unit.unitNumber }}</h4>
                <p class="text-xs text-[var(--color-text-secondary)] mt-1">{{ unit.words.length }} كلمة</p>
              </div>
              <div class="flex items-center gap-2 mr-4">
                <button (click)="onMarkUnit(student.id, unit.unitNumber)"
                  class="px-3 py-2 rounded-none text-xs font-semibold border transition-all cursor-pointer"
                  [class]="getUnitStatus(student, unit.unitNumber) === 'memorized'
                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                    : 'bg-[var(--color-canvas)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'"
                  [attr.aria-label]="getUnitStatus(student, unit.unitNumber) === 'memorized' ? 'محفوظ' : 'تحديد كمحفوظ'">
                  <span class="material-icons text-sm align-middle">{{ getUnitStatus(student, unit.unitNumber) === 'memorized' ? 'check_circle' : 'check_circle_outline' }}</span>
                  {{ getUnitStatus(student, unit.unitNumber) === 'memorized' ? 'محفوظ' : 'تحديد كمحفوظ' }}
                </button>
                <button (click)="onReviewUnit(student.id, unit.unitNumber)"
                  class="px-3 py-2 rounded-none text-xs font-semibold border transition-all cursor-pointer"
                  [class]="getUnitStatus(student, unit.unitNumber) === 'review'
                    ? 'bg-[var(--color-amber)] text-white border-[var(--color-amber)]'
                    : 'bg-[var(--color-canvas)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-amber)] hover:text-[var(--color-amber)]'"
                  aria-label="مراجعة">
                  <span class="material-icons text-sm align-middle">sync</span>
                  مراجعة
                </button>
                @if (getUnitStatus(student, unit.unitNumber) !== 'none') {
                <button (click)="onClearUnit(student.id, unit.unitNumber)"
                  class="px-3 py-2 rounded-none text-xs font-semibold border bg-[var(--color-canvas)] text-red-500 border-red-200 hover:bg-red-50 transition-all cursor-pointer"
                  aria-label="مسح التحديد">
                  <span class="material-icons text-sm align-middle">restart_alt</span>
                  مسح
                </button>
                }
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2">
              @for (word of unit.words; track $index) {
              <div class="flex items-center gap-2 p-2.5 rounded-none border border-[var(--color-border-light)]">
                <div class="min-w-0 flex-1">
                  <p class="font-bold text-[var(--color-text-primary)] text-sm leading-tight">{{ word.word }}</p>
                  <p class="text-[10px] leading-tight text-[var(--color-text-secondary)]">{{ word.definition }}</p>
                </div>
              </div>
              }
            </div>
          </div>
          }
        </div>
      </div>
      }
    </div>
  `,
})
export class EnglishTrailComponent {
  state = inject(TrackerState);
  toast = inject(ToastService);
  selectedUnit = signal<EnglishUnitWithWords | null>(null);

  getUnitStatus(student: Student, unitNumber: number): 'memorized' | 'review' | 'none' {
    if (student.memorizedEnglishUnits.includes(unitNumber)) return 'memorized';
    if (student.reviewEnglishUnits.includes(unitNumber)) return 'review';
    return 'none';
  }

  onUnitClick(unit: EnglishUnitWithWords) {
    this.selectedUnit.set(unit);
  }

  onMarkUnit(studentId: string, unitNumber: number) {
    this.state.toggleEnglishStatus(studentId, unitNumber, 'memorized');
    this.toast.show('تم تحديد الوحدة كمحفوظة.');
  }

  onReviewUnit(studentId: string, unitNumber: number) {
    this.state.toggleEnglishStatus(studentId, unitNumber, 'review');
    this.toast.show('تم تحديد الوحدة للمراجعة.');
  }

  onClearUnit(studentId: string, unitNumber: number) {
    this.state.toggleEnglishStatus(studentId, unitNumber, 'none');
    this.toast.show('تم مسح التحديد.');
  }
}
