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
      <div class="bg-[var(--color-surface)] rounded-none p-6 border border-[var(--color-border)] flex flex-col items-center text-center">
        <div class="w-16 h-16 rounded-none bg-[var(--color-primary-light)] flex items-center justify-center mb-4 relative">
          <span class="material-icons text-3xl text-[var(--color-primary)]">{{ stage.badgeIcon }}</span>
          @if (student.xp >= 10000) {
          <span class="absolute -top-1 -right-1 text-sm animate-bounce">👑</span>
          }
        </div>

        <span class="text-[10px] font-bold text-[var(--color-text-tertiary)] tracking-widest uppercase">المرحلة الحالية</span>
        <h4 class="font-inter text-xl font-bold text-[var(--color-text-primary)] mt-1">{{ stage.name }}</h4>
        <p class="text-xs text-[var(--color-text-secondary)] mt-2 leading-relaxed max-w-[200px]">{{ stage.description }}</p>

        <div class="w-full mt-5 p-4 rounded-none bg-[var(--color-canvas)] border border-[var(--color-border-light)]">
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
          <div class="w-full bg-[var(--color-border)] rounded-none h-1.5 overflow-hidden mt-2">
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

      <!-- Badges -->
      <div class="bg-[var(--color-surface)] rounded-none p-5 border border-[var(--color-border)]">
        <h4 class="font-inter text-sm font-bold mb-3 text-[var(--color-text-secondary)] flex items-center gap-2">
          <span class="material-icons text-[var(--color-primary)]">workspace_premium</span>
          أوسمة الحفظ
        </h4>
        <div class="grid grid-cols-4 gap-3">
          @for (badge of getUnlockedBadges(student); track badge.name) {
          <div class="flex flex-col items-center group relative cursor-help" [title]="badge.name + ': ' + badge.desc">
            <div [class]="badge.unleased
              ? 'w-10 h-10 rounded-none bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center transition-all group-hover:scale-105'
              : 'w-10 h-10 rounded-none bg-[var(--color-canvas)] text-[var(--color-text-tertiary)] flex items-center justify-center grayscale'">
              <span class="material-icons text-lg">{{ badge.icon }}</span>
              @if (!badge.unleased) {
              <span class="material-icons absolute bottom-0 right-0 text-[8px] text-[var(--color-text-tertiary)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-none p-0.5">lock</span>
              }
            </div>
            <span class="text-[8px] text-center font-semibold mt-1 select-none truncate w-full" [class.text-[var(--color-text-tertiary)]]="!badge.unleased">
              {{ badge.name.replace('وسام ', '') }}
            </span>
          </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class StudentStageCardComponent {
  state = inject(TrackerState);
  student = input.required<Student>();

  getUnlockedBadges(student: Student) {
    const badges: { name: string; desc: string; icon: string; unleased: boolean }[] = [];
    const memorizedSet = new Set(student.memorizedHadithNumbers);

    badges.push({ name: 'البذرة الأولى', desc: 'حفظ أول حديث نبوي شريف.', icon: 'energy_savings_leaf', unleased: student.memorizedHadithNumbers.length >= 1 });
    badges.push({ name: 'الخمسة الندية', desc: 'إتمام حفظ 5 أحاديث نبوية.', icon: 'spa', unleased: student.memorizedHadithNumbers.length >= 5 });
    badges.push({ name: 'العشرة المباركة', desc: 'إتمام حفظ 10 أحاديث نبوية.', icon: 'grade', unleased: student.memorizedHadithNumbers.length >= 10 });
    badges.push({ name: 'نصف الطريق', desc: 'إتمام حفظ 20 حديثاً شريفاً.', icon: 'explore', unleased: student.memorizedHadithNumbers.length >= 20 });
    badges.push({ name: 'حافظ الأربعين', desc: 'إتمام حفظ 40 حديثاً نبوياً كاملاً.', icon: 'military_tech', unleased: student.memorizedHadithNumbers.length >= this.state.hadiths().length });
    badges.push({ name: 'سورة النور', desc: 'حفظ أول سورة من القرآن.', icon: 'auto_stories', unleased: student.memorizedSurahNumbers.length >= 1 });
    badges.push({ name: 'حامل الجزء', desc: 'حفظ أكثر من 15 سورة.', icon: 'import_contacts', unleased: student.memorizedSurahNumbers.length >= 15 });
    badges.push({ name: 'الكلمة الأولى', desc: 'حفظ الوحدة الإنجليزية الأولى.', icon: 'translate', unleased: student.memorizedEnglishUnits.length >= 1 });
    badges.push({ name: 'السفير الماهر', desc: 'إتمام حفظ أكثر من 20 وحدة إنجليزية.', icon: 'public', unleased: student.memorizedEnglishUnits.length >= 20 });

    const specificHadiths = [1, 6, 15, 22, 29];
    specificHadiths.forEach((num) => {
      const hadith = this.state.hadiths().find((h) => h.number === num);
      if (hadith) {
        badges.push({ name: `وسام ${hadith.badgeName}`, desc: `حفظ الحديث رقم ${num}.`, icon: hadith.badgeIcon, unleased: memorizedSet.has(num) });
      }
    });

    return badges;
  }
}
