import { Component, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { TrackerState } from '../../state';
import { ModalService } from '../../shared/services/modal.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="panel p-5">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 bg-[var(--color-primary-light)] flex items-center justify-center">
              <span class="material-icons text-[var(--color-primary)]">groups</span>
            </div>
            <span class="text-xs text-[var(--color-text-secondary)] font-semibold">الحفاظ الصغار</span>
          </div>
          <p class="text-3xl font-bold text-[var(--color-text-primary)]">{{ state.stats().totalStudents }}</p>
          <p class="text-xs text-[var(--color-green)] mt-2 font-medium flex items-center gap-1">
            <span class="material-icons text-sm">check_circle</span>
            طلاب نشطون
          </p>
        </div>

        <div class="panel p-5">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 bg-[var(--color-primary-light)] flex items-center justify-center">
              <span class="material-icons text-[var(--color-primary)]">emoji_events</span>
            </div>
            <span class="text-xs text-[var(--color-text-secondary)] font-semibold">مجموع النقاط</span>
          </div>
          <p class="text-3xl font-bold text-[var(--color-primary-dark)]">{{ state.stats().totalXP }}</p>
          <p class="text-xs text-[var(--color-text-secondary)] mt-2 font-medium flex items-center gap-1">
            <span class="material-icons text-sm">done_all</span>
            حصيلة الحفظ
          </p>
        </div>

        <div class="panel p-5">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 bg-[var(--color-amber-light)] flex items-center justify-center">
              <span class="material-icons text-[var(--color-amber)]">query_stats</span>
            </div>
            <span class="text-xs text-[var(--color-text-secondary)] font-semibold">متوسط الطالب</span>
          </div>
          <p class="text-3xl font-bold text-[var(--color-text-primary)]">{{ state.stats().averageXP }} <span class="text-sm font-medium text-[var(--color-text-secondary)]">XP</span></p>
          <p class="text-xs text-[var(--color-text-secondary)] mt-2 font-medium flex items-center gap-1">
            <span class="material-icons text-sm">trending_up</span>
            معدل مستمر
          </p>
        </div>

        <div class="panel p-5 border-[var(--color-primary)]">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 bg-[var(--color-amber-light)] flex items-center justify-center">
              <span class="material-icons text-[var(--color-amber)]">stars</span>
            </div>
            <span class="text-xs text-[var(--color-primary-dark)] font-semibold">صاحب الصدارة</span>
          </div>
          @if (state.stats().topStudent; as top) {
          <p class="text-lg font-bold text-[var(--color-text-primary)] truncate">{{ top.name }}</p>
          <p class="text-xs text-[var(--color-primary-dark)] mt-2 font-bold bg-[var(--color-primary-light)] px-3 py-1 inline-block">
            {{ top.xp }} نقطة
          </p>
          } @else {
          <p class="text-sm text-[var(--color-text-tertiary)]">لا يوجد طلاب</p>
          }
        </div>
      </div>

      <div class="panel overflow-hidden">
        <div class="p-6 flex flex-col sm:flex-row items-center gap-6">
          <div class="relative w-28 h-28 shrink-0">
            <svg class="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-border-light)" stroke-width="8" />
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-primary)" stroke-width="8"
                stroke-linecap="round"
                [attr.stroke-dasharray]="326.73"
                [attr.stroke-dashoffset]="326.73 * (1 - state.quranProgress().percentage / 100)"
                class="transition-all duration-1000 ease-out" />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-2xl font-bold text-[var(--color-primary)]">{{ state.quranProgress().percentage }}%</span>
            </div>
          </div>

          <div class="flex-1 text-center sm:text-right">
            <div class="flex items-center gap-2 mb-2">
              <span class="material-icons text-[var(--color-green)]">auto_stories</span>
              <h3 class="font-tajawal text-lg font-bold text-[var(--color-text-primary)]">تقدم حفظ القرآن الكريم</h3>
            @if (state.selectedStudent(); as s) {
              <p class="text-xs text-[var(--color-primary-dark)] font-semibold">{{ s.name }}</p>
            }
            </div>
            <p class="text-sm text-[var(--color-text-secondary)] mb-4">
              حفظ <span class="font-bold text-[var(--color-primary)]">{{ state.quranProgress().totalMemorized }}</span> من 114 سورة
            </p>

            <div class="w-full h-3 bg-[var(--color-canvas)] overflow-hidden flex">
              <div class="progress-fill-green"
                [style.width.%]="state.quranProgress().percentage"
                title="{{ state.quranProgress().totalMemorized }} سورة محفوظة"></div>
            </div>

            <div class="flex items-center justify-between mt-2 text-xs">
              <span class="text-[var(--color-text-tertiary)]">0</span>
              <span class="text-[var(--color-text-secondary)] font-semibold">{{ state.quranProgress().totalMemorized }} / 114 سورة</span>
              <span class="text-[var(--color-text-tertiary)]">114</span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="panel p-6 lg:col-span-2">
          <div class="panel-header">
            <h3 class="panel-title">
              <span class="panel-title-icon">emoji_events</span>
              قائمة الصدارة
            </h3>
            <span class="text-xs text-[var(--color-text-tertiary)] font-medium">محدث لحظياً</span>
          </div>

          <div class="space-y-2">
            @for (student of sortedStudents; track student.id; let idx = $index) {
            @let isTop = idx === 0 && student.xp > 0;
            @let stage = state.getStudentStage(student);
            <div [class]="isTop
              ? 'flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[var(--color-primary-light)] border border-[var(--color-primary)]/20 transition-all duration-300'
              : 'flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[var(--color-canvas)] border border-[var(--color-border-light)] transition-all duration-300 hover:border-[var(--color-primary)]/30'">
              <div class="flex items-center gap-3 w-full sm:w-auto">
                <div class="w-12 h-12 flex items-center justify-center font-bold text-sm shrink-0"
                  [class]="isTop ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-border)] text-[var(--color-text-secondary)]'">
                  {{ idx + 1 }}
                </div>
                <div class="w-10 h-10 bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-lg shrink-0">
                  {{ getAvatarEmoji(student.avatar) }}
                </div>
                <div>
                  <p class="font-bold text-sm text-[var(--color-text-primary)] flex items-center gap-1.5">
                    <span>{{ student.name }}</span>
                    @if (isTop) {
                    <span class="material-icons text-[var(--color-primary)] text-sm">military_tech</span>
                    }
                  </p>
                  <div class="flex items-center gap-2 text-xs text-[var(--color-text-secondary)] mt-0.5">
                    <span class="font-semibold text-[var(--color-primary-dark)]">{{ stage.name }}</span>
                    <span class="text-[var(--color-text-tertiary)]">·</span>
                    <span>{{ student.xp }} نقطة</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-2 mt-3 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                <div class="flex gap-1.5 text-xs font-semibold flex-wrap">
                  <span class="tag tag-primary">
                    <span class="material-icons text-[10px]">menu_book</span>
                    {{ student.memorizedHadithNumbers.length }}
                  </span>
                  <span class="tag tag-blue">
                    <span class="material-icons text-[10px]">auto_stories</span>
                    {{ student.memorizedSurahNumbers.length }}
                  </span>
                  <span class="tag tag-green">
                    <span class="material-icons text-[10px]">translate</span>
                    {{ student.memorizedEnglishUnits.length }}
                  </span>
                </div>
                <button (click)="goToStudent(student.id)"
                  class="btn btn-ghost btn-icon" title="انتقل لمسار الحفظ" aria-label="انتقل لمسار الحفظ">
                  <span class="material-icons text-sm material-icons-arrow-rtl">arrow_back</span>
                </button>
              </div>
            </div>
            } @empty {
            <div class="empty-state">
              <span class="empty-state-icon">group_off</span>
              <p class="empty-state-text">لا يوجد طلاب مسجلون</p>
              <button (click)="showAddStudent()" class="btn btn-primary btn-md mt-4">سجل أول طالب</button>
            </div>
            }
          </div>

          @if (state.students().length > 0) {
          <div class="mt-4 p-4 bg-[var(--color-green-light)] border border-[var(--color-green)]/20 text-[var(--color-text-primary)] text-xs leading-relaxed flex items-start gap-2">
            <span class="material-icons text-[var(--color-green)] shrink-0 mt-0.5">lightbulb</span>
            <p>
              <strong>فكرة تربوية:</strong> لتشجيع الحفاظ الصغار، يمكن إعطاء جائزة عينية لمرتقي كل مرحلة!
            </p>
          </div>
          }
        </div>

        <div class="panel p-6 flex flex-col">
          <div class="panel-header">
            <h3 class="panel-title">
              <span class="panel-title-icon">wb_sunny</span>
              الحديث لليوم
            </h3>
          </div>

          @if (hadithOfTheDay(); as hadith) {
          <div class="flex-1 flex flex-col items-center justify-center text-center px-2">
            <span class="tag tag-primary mb-4">الحديث رقم {{ hadith.number }}</span>
            <h4 class="font-bold text-base text-[var(--color-text-primary)] mb-3">{{ hadith.category }}</h4>
            <p class="font-amiri text-xl font-bold text-[var(--color-primary-dark)] leading-relaxed mb-4">
              "{{ hadith.text }}"
            </p>
            <p class="text-xs text-[var(--color-text-secondary)] mb-4">
              الراوي: {{ hadith.reference }}
            </p>
            <div class="w-full p-4 bg-[var(--color-canvas)] border border-[var(--color-border-light)] text-right">
              <span class="text-xs text-[var(--color-primary)] font-bold block mb-1.5 flex items-center gap-1">
                <span class="material-icons text-sm">spa</span>
                الدرس والعمل:
              </span>
              <p class="text-xs text-[var(--color-text-secondary)] leading-relaxed">{{ hadith.explanation }}</p>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-[var(--color-border-light)] text-center">
            <p class="text-[11px] text-[var(--color-text-tertiary)]">الأحاديث مأخوذة من كتاب إتحاف الأخيار للشيخ سعيد بن مبروك القنوبي</p>
          </div>
          } @else {
          <div class="flex-1 flex items-center justify-center">
            <p class="text-sm text-[var(--color-text-tertiary)]">لا توجد أحاديث مضافة بعد</p>
          </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent {
  state = inject(TrackerState);
  private router = inject(Router);
  private modal = inject(ModalService);

  private avatarMap: Record<string, string> = {
    'avatar-leaf': '🌿', 'avatar-mountain': '🏔️', 'avatar-sun': '☀️',
    'avatar-flower': '🌸', 'avatar-water': '💧', 'avatar-shield': '🛡️',
  };

  /** Picks a deterministic random hadith based on today's date */
  hadithOfTheDay = computed(() => {
    const hadiths = this.state.hadiths();
    if (hadiths.length === 0) return null;

    // Use the date as a seed so the same hadith shows all day
    const today = new Date();
    const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const index = dateSeed % hadiths.length;
    return hadiths[index];
  });

  get allHadiths() { return this.state.hadiths(); }

  get sortedStudents() {
    return [...this.state.students()].sort((a, b) => b.xp - a.xp);
  }

  getAvatarEmoji(key: string): string {
    return this.avatarMap[key] || '🌿';
  }

  goToStudent(studentId: string) {
    this.state.selectedStudentId.set(studentId);
    this.router.navigate(['/hadith']);
  }

  showAddStudent() {
    this.modal.showAddStudent.set(true);
  }
}
