import { Component, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { TrackerState } from '../../state';
import { ModalService } from '../../shared/services/modal.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="space-y-8">
      <!-- Stats Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div class="bg-[var(--color-surface)] rounded-none p-5 border border-[var(--color-border)]">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-none bg-[var(--color-primary-light)] flex items-center justify-center">
              <span class="material-icons text-[var(--color-primary)]">groups</span>
            </div>
            <span class="text-xs text-[var(--color-text-secondary)] font-semibold">الحفاظ الصغار</span>
          </div>
          <p class="text-3xl font-bold text-[var(--color-text-primary)] font-inter">{{ state.stats().totalStudents }}</p>
          <p class="text-xs text-[var(--color-green)] mt-2 font-medium flex items-center gap-1">
            <span class="material-icons text-sm">check_circle</span>
            طلاب نشطون
          </p>
        </div>

        <div class="bg-[var(--color-surface)] rounded-none p-5 border border-[var(--color-border)]">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-none bg-[var(--color-primary-light)] flex items-center justify-center">
              <span class="material-icons text-[var(--color-primary)]">emoji_events</span>
            </div>
            <span class="text-xs text-[var(--color-text-secondary)] font-semibold">مجموع النقاط</span>
          </div>
          <p class="text-3xl font-bold text-[var(--color-primary-dark)] font-inter">{{ state.stats().totalXP }}</p>
          <p class="text-xs text-[var(--color-text-secondary)] mt-2 font-medium flex items-center gap-1">
            <span class="material-icons text-sm">done_all</span>
            حصيلة الحفظ
          </p>
        </div>

        <div class="bg-[var(--color-surface)] rounded-none p-5 border border-[var(--color-border)]">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-none bg-[var(--color-amber-light)] flex items-center justify-center">
              <span class="material-icons text-[var(--color-amber)]">query_stats</span>
            </div>
            <span class="text-xs text-[var(--color-text-secondary)] font-semibold">متوسط الطالب</span>
          </div>
          <p class="text-3xl font-bold text-[var(--color-text-primary)] font-inter">{{ state.stats().averageXP }} <span class="text-sm font-medium text-[var(--color-text-secondary)]">XP</span></p>
          <p class="text-xs text-[var(--color-text-secondary)] mt-2 font-medium flex items-center gap-1">
            <span class="material-icons text-sm">trending_up</span>
            معدل مستمر
          </p>
        </div>

        <div class="bg-[var(--color-surface)] rounded-none p-5 border border-[var(--color-primary)]">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-none bg-[var(--color-amber-light)] flex items-center justify-center">
              <span class="material-icons text-[var(--color-amber)]">stars</span>
            </div>
            <span class="text-xs text-[var(--color-primary-dark)] font-semibold">صاحب الصدارة</span>
          </div>
          @if (state.stats().topStudent; as top) {
          <p class="text-lg font-bold text-[var(--color-text-primary)] font-inter truncate">{{ top.name }}</p>
          <p class="text-xs text-[var(--color-primary-dark)] mt-2 font-bold bg-[var(--color-primary-light)] px-3 py-1 rounded-none inline-block">
            {{ top.xp }} نقطة
          </p>
          } @else {
          <p class="text-sm text-[var(--color-text-tertiary)]">لا يوجد طلاب</p>
          }
        </div>
      </div>
      <!-- Quran Progress -->
      <div class="bg-[var(--color-surface)] rounded-none border border-[var(--color-border)] overflow-hidden">
        <div class="p-6 flex flex-col sm:flex-row items-center gap-6">
          <!-- Circular Progress -->
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
              <span class="text-2xl font-bold text-[var(--color-primary)] font-inter">{{ state.quranProgress().percentage }}%</span>
            </div>
          </div>

          <!-- Info -->
          <div class="flex-1 text-center sm:text-right">
            <div class="flex items-center gap-2 mb-2">
              <span class="material-icons text-[var(--color-green)]">auto_stories</span>
              <h3 class="font-inter text-lg font-bold text-[var(--color-text-primary)]">تقدم حفظ القرآن الكريم</h3>
            @if (state.selectedStudent(); as s) {
              <p class="text-xs text-[var(--color-primary-dark)] font-semibold">{{ s.name }}</p>
            }
            </div>
            <p class="text-sm text-[var(--color-text-secondary)] mb-4">
              حفظ <span class="font-bold text-[var(--color-primary)]">{{ state.quranProgress().totalMemorized }}</span> من 114 سورة
            </p>

            <!-- Segment bar -->
            <div class="w-full h-3 bg-[var(--color-canvas)] rounded-none overflow-hidden flex">
              <div class="bg-[var(--color-green)] h-full transition-all duration-1000 ease-out"
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

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Leaderboard -->
        <div class="bg-[var(--color-surface)] rounded-none p-6 border border-[var(--color-border)] lg:col-span-2">
          <div class="flex items-center justify-between mb-5 pb-4 border-b border-[var(--color-border-light)]">
            <h3 class="font-inter text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
              <span class="material-icons text-[var(--color-primary)]">emoji_events</span>
              قائمة الصدارة
            </h3>
            <span class="text-xs text-[var(--color-text-tertiary)] font-medium">محدث لحظياً</span>
          </div>

          <div class="space-y-3">
            @for (student of sortedStudents; track student.id; let idx = $index) {
            @let isTop = idx === 0 && student.xp > 0;
            @let stage = state.getStudentStage(student);
            <div [class]="isTop
              ? 'flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-none bg-[var(--color-primary-light)] border border-[var(--color-primary)]/20 transition-all duration-300'
              : 'flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-none bg-[var(--color-canvas)] border border-[var(--color-border-light)] transition-all duration-300 hover:border-[var(--color-primary)]/30'">
              <div class="flex items-center gap-3 w-full sm:w-auto">
                <div class="w-12 h-12 rounded-none flex items-center justify-center font-bold text-sm font-inter shrink-0"
                  [class]="isTop ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-border)] text-[var(--color-text-secondary)]'">
                  {{ idx + 1 }}
                </div>
                <div class="w-10 h-10 rounded-none bg-white border border-[var(--color-border)] flex items-center justify-center text-lg shrink-0">
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
                    <span>·</span>
                    <span>{{ student.xp }} نقطة</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-2 mt-3 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                <div class="flex gap-1.5 text-xs font-semibold font-inter flex-wrap">
                  <span class="bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] px-2 py-1 rounded-none flex items-center gap-1">
                    <span class="material-icons text-[10px]">menu_book</span>
                    {{ student.memorizedHadithNumbers.length }}
                  </span>
                  <span class="bg-[var(--color-blue-light)] text-blue-700 px-2 py-1 rounded-none flex items-center gap-1">
                    <span class="material-icons text-[10px]">auto_stories</span>
                    {{ student.memorizedSurahNumbers.length }}
                  </span>
                  <span class="bg-[var(--color-green-light)] text-green-700 px-2 py-1 rounded-none flex items-center gap-1">
                    <span class="material-icons text-[10px]">translate</span>
                    {{ student.memorizedEnglishUnits.length }}
                  </span>
                </div>
                <button (click)="goToStudent(student.id)"
                  class="w-12 h-12 rounded-none bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[var(--color-canvas)] transition-all duration-200 cursor-pointer shrink-0" title="انتقل لمسار الحفظ" aria-label="انتقل لمسار الحفظ">
                  <span class="material-icons text-sm material-icons-arrow-rtl">arrow_back</span>
                </button>
              </div>
            </div>
            } @empty {
            <div class="text-center py-10 rounded-none bg-[var(--color-canvas)] border border-[var(--color-border-light)]">
              <span class="material-icons text-4xl text-[var(--color-text-tertiary)]">group_off</span>
              <p class="text-[var(--color-text-secondary)] mt-2 font-semibold text-sm">لا يوجد طلاب مسجلون</p>
              <button (click)="showAddStudent()" class="sketch-button mt-4 px-5 py-2 text-xs font-semibold cursor-pointer">سجل أول طالب</button>
            </div>
            }
          </div>

          @if (state.students().length > 0) {
          <div class="mt-5 p-4 rounded-none bg-[var(--color-green-light)] border border-[var(--color-green)]/20 text-[var(--color-text-primary)] text-xs leading-relaxed flex items-start gap-2">
            <span class="material-icons text-[var(--color-green)] shrink-0 mt-0.5">lightbulb</span>
            <p>
              <strong>فكرة تربوية:</strong> لتشجيع الحفاظ الصغار، يمكن إعطاء جائزة عينية لمرتقي كل مرحلة!
            </p>
          </div>
          }
        </div>

        <!-- Hadith of the Day -->
        <div class="bg-[var(--color-surface)] rounded-none p-6 border border-[var(--color-border)] flex flex-col">
          <div class="flex items-center gap-2 mb-5 pb-4 border-b border-[var(--color-border-light)]">
            <span class="material-icons text-[var(--color-primary)]">wb_sunny</span>
            <h3 class="font-inter text-lg font-bold text-[var(--color-text-primary)]">الحديث لليوم</h3>
          </div>

          @if (hadithOfTheDay(); as hadith) {
          <div class="flex-1 flex flex-col items-center justify-center text-center px-2">
            <span class="text-[var(--color-primary)] bg-[var(--color-primary-light)] px-3 py-1 rounded-none text-xs font-bold inline-block mb-4">الحديث رقم {{ hadith.number }}</span>
            <h4 class="font-bold text-base text-[var(--color-text-primary)] mb-3">{{ hadith.category }}</h4>
            <p class="font-amiri text-xl font-bold text-[var(--color-primary-dark)] leading-relaxed mb-4">
              "{{ hadith.text }}"
            </p>
            <p class="text-xs text-[var(--color-text-secondary)] mb-4">
              الراوي: {{ hadith.reference }}
            </p>
            <div class="w-full p-4 rounded-none bg-[var(--color-canvas)] border border-[var(--color-border-light)] text-right">
              <span class="text-xs text-[var(--color-primary)] font-bold block mb-1.5 flex items-center gap-1">
                <span class="material-icons text-sm">spa</span>
                الدرس والعمل:
              </span>
              <p class="text-xs text-[var(--color-text-secondary)] leading-relaxed">{{ hadith.explanation }}</p>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-[var(--color-border-light)] text-center">
            <p class="text-[10px] text-[var(--color-text-tertiary)]">الأحاديث مأخوذة من كتاب إتحاف الأخيار للشيخ سعيد بن مبروك القنوبي</p>
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
