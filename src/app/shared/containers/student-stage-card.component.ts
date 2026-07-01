import { Component, inject, input } from '@angular/core';
import { TrackerState, Student } from '../../state';

@Component({
  selector: 'app-student-stage-card',
  template: `
    @let student = this.student();
    @let stage = state.getStudentStage(student);
    @let nextStageInfo = state.getStudentNextStageInfo(student);

    <div class="space-y-4 lg:col-span-1">
      <!-- Stage Card -->
      <div class="panel p-6 flex flex-col items-center text-center">
        <div class="w-16 h-16 rounded-none bg-[var(--color-primary-light)] flex items-center justify-center mb-4 relative">
          <span class="material-icons text-3xl text-[var(--color-primary)]">{{ stage.badgeIcon }}</span>
          @if (student.xp >= 10000) {
          <span class="absolute -top-1 -right-1 text-sm animate-bounce">👑</span>
          }
        </div>

        <span class="text-[11px] font-bold text-[var(--color-text-tertiary)] tracking-widest uppercase">المرحلة الحالية</span>
        <h4 class="font-tajawal text-xl font-bold text-[var(--color-text-primary)] mt-1">{{ stage.name }}</h4>
        <p class="text-xs text-[var(--color-text-secondary)] mt-2 leading-relaxed max-w-[200px]">{{ stage.description }}</p>

        <div class="w-full mt-5 p-4 bg-[var(--color-canvas)] border border-[var(--color-border-light)]">
          @if (nextStageInfo) {
          <p class="text-xs font-semibold text-[var(--color-text-secondary)] mb-2">
            يتبقى للوصول إلى <span class="text-[var(--color-primary-dark)] font-bold">{{ nextStageInfo.nextStage.name }}</span>:
          </p>
          <div class="flex items-center justify-between text-xs mb-1.5">
            <span class="text-[var(--color-primary-dark)] bg-[var(--color-primary-light)] px-2.5 py-0.5 rounded-none font-bold">
              {{ nextStageInfo.remaining }} نقطة
            </span>
            <span class="text-[var(--color-text-tertiary)] font-medium">{{ student.xp }} / {{ nextStageInfo.nextStage.minXP }}</span>
          </div>
          @let minTarget = nextStageInfo.nextStage.minXP; @let prevTarget = stage.minXP;
          @let currentInLevel = student.xp - prevTarget; @let totalRequiredInLevel = minTarget - prevTarget;
          @let percentageInLevel = (currentInLevel / totalRequiredInLevel) * 100;
          <div class="w-full bg-[var(--color-border)] rounded-none h-1.5 overflow-hidden mt-2 flex justify-end">
            <div class="bg-[var(--color-primary)] h-full rounded-none transition-all" [style.width.%]="percentageInLevel"></div>
          </div>
          } @else {
          <p class="text-xs font-bold text-[var(--color-green)] flex items-center justify-center gap-1">
            <span class="material-icons text-sm">emoji_events</span>
            ما شاء الله! وصل لأعلى المراحل
          </p>
          }
        </div>

        <div class="w-full flex justify-between items-center text-xs mt-4 pt-3 border-t border-[var(--color-border-light)]">
          <span class="text-[var(--color-text-secondary)] font-medium">النقاط الكلية:</span>
          <span class="font-bold text-[var(--color-text-primary)] bg-[var(--color-canvas)] px-3 py-1 rounded-none border border-[var(--color-border)]">
            {{ student.xp }} XP
          </span>
        </div>
      </div>

    </div>
  `,
})
export class StudentStageCardComponent {
  state = inject(TrackerState);
  student = input.required<Student>();

}
