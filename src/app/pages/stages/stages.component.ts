import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TrackerState, Student, STAGES } from '../../state';
import { ToastService } from '../../shared/services/toast.service';
import { ModalService } from '../../shared/services/modal.service';
import { CelebrationService } from '../../shared/services/celebration.service';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-stages',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Admin Tools Column -->
        <div class="space-y-4 lg:col-span-1">
          <!-- Stats Card -->
          <div class="bg-[var(--color-surface)] rounded-none p-5 border border-[var(--color-border)]">
            <h3 class="font-inter text-sm font-bold mb-4 text-[var(--color-text-secondary)] flex items-center gap-2">
              <span class="material-icons text-[var(--color-primary)]">dashboard</span>
              إحصائيات الإدارة
            </h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center p-3 bg-[var(--color-canvas)] border border-[var(--color-border-light)]">
                <span class="text-xs font-medium text-[var(--color-text-secondary)]">إجمالي الطلاب</span>
                <span class="font-bold text-sm text-[var(--color-primary-dark)]">{{ state.students().length }}</span>
              </div>
              <div class="flex justify-between items-center p-3 bg-[var(--color-canvas)] border border-[var(--color-border-light)]">
                <span class="text-xs font-medium text-[var(--color-text-secondary)]">مجموع النقاط</span>
                <span class="font-bold text-sm text-[var(--color-primary-dark)]">{{ totalXP }} XP</span>
              </div>
              <div class="flex justify-between items-center p-3 bg-[var(--color-canvas)] border border-[var(--color-border-light)]">
                <span class="text-xs font-medium text-[var(--color-text-secondary)]">أعلى طالب</span>
                <span class="font-bold text-sm text-[var(--color-primary-dark)]">{{ topStudentName }}</span>
              </div>
            </div>
          </div>

          <!-- Batch Actions -->
          <div class="bg-[var(--color-surface)] rounded-none p-5 border border-[var(--color-border)]">
            <h3 class="font-inter text-sm font-bold mb-4 text-[var(--color-text-secondary)] flex items-center gap-2">
              <span class="material-icons text-[var(--color-primary)]">build</span>
              أدوات الإدارة
            </h3>
            <div class="space-y-2">
              <button (click)="showAddStudent()"
                class="w-full flex items-center gap-2 px-4 py-2.5 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-none hover:bg-[var(--color-primary-hover)] transition-colors cursor-pointer">
                <span class="material-icons text-sm">person_add</span>
                إضافة طالب جديد
              </button>
              <p class="text-[10px] text-[var(--color-text-tertiary)] leading-relaxed mt-2 p-2 bg-[var(--color-amber-light)] border border-[var(--color-amber)]/30">
                <span class="font-semibold">ختم 40:</span> يوسم جميع الأحاديث الأربعين كمحفوظة دفعة واحدة.
                <br><span class="font-semibold">تصفير:</span> يعيد تعيين سجل حفظ الطالب بالكامل.
              </p>
            </div>
          </div>
        </div>

        <!-- Students Directory -->
        <div class="space-y-4 lg:col-span-2">
          <div class="bg-[var(--color-surface)] rounded-none p-5 border border-[var(--color-border)]">
            <div class="flex items-center justify-between mb-5 pb-4 border-b border-[var(--color-border-light)]">
              <h3 class="font-inter text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                <span class="material-icons text-[var(--color-primary)]">people</span>
                الطلاب النشطون
              </h3>
              <span class="text-xs text-[var(--color-primary-dark)] font-semibold bg-[var(--color-primary-light)] px-3 py-1 rounded-none">
                {{ state.students().length }} طلاب
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              @for (student of state.students(); track student.id) {
              @let stage = state.getStudentStage(student);
              <div class="bg-[var(--color-canvas)] rounded-none p-4 border border-[var(--color-border-light)] flex flex-col justify-between">
                <div>
                  <div class="flex items-start justify-between gap-2 mb-3">
                    <div class="flex items-center gap-2.5">
                      <div class="w-9 h-9 rounded-none bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-lg shrink-0">
                        {{ getAvatarEmoji(student.avatar) }}
                      </div>
                      <div>
                        <h4 class="font-bold text-sm text-[var(--color-text-primary)]">{{ student.name }}</h4>
                        <p class="text-[10px] text-[var(--color-text-tertiary)] font-medium">{{ student.age ? student.age + ' سنة' : 'غير محدد' }}</p>
                      </div>
                    </div>
                    <span class="text-[9px] font-bold bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] px-2 py-0.5 rounded-none">{{ stage.name }}</span>
                  </div>

                  <div class="my-3">
                    <div class="flex justify-between text-[10px] font-semibold text-[var(--color-text-secondary)] mb-1">
                      <span>الأحاديث:</span>
                      <span class="text-[var(--color-primary-dark)]">{{ student.memorizedHadithNumbers.length }} / {{ state.hadiths().length }}</span>
                    </div>
                    <div class="w-full bg-[var(--color-border)] rounded-none h-1 overflow-hidden">
                      <div class="bg-[var(--color-primary)] h-full rounded-none transition-all"
                        [style.width.%]="(student.memorizedHadithNumbers.length / (state.hadiths().length || 1)) * 100"></div>
                    </div>
                  </div>

                  @if (student.notes) {
                  <p class="text-[10px] text-[var(--color-text-tertiary)] bg-[var(--color-surface)] p-2 rounded-none border border-[var(--color-border-light)] italic mb-3 max-h-12 overflow-y-auto">
                    "{{ student.notes }}"
                  </p>
                  }
                </div>

                <div class="flex items-center justify-between pt-2.5 border-t border-[var(--color-border-light)]">
                  <div class="flex gap-1.5">
                    <button (click)="openEditStudent(student)" class="w-12 h-12 rounded-none bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] cursor-pointer transition-colors" title="تعديل" aria-label="تعديل الطالب">
                      <span class="material-icons text-xs">edit</span>
                    </button>
                    <button (click)="onDeleteStudent(student.id, student.name)" class="w-12 h-12 rounded-none bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-tertiary)] hover:border-red-500 hover:text-red-500 cursor-pointer transition-colors" title="حذف" aria-label="حذف الطالب">
                      <span class="material-icons text-xs">delete</span>
                    </button>
                  </div>
                  <div class="flex gap-1.5">
                    <button (click)="cheatUnlockAll(student.id)" class="px-2 py-1 text-[9px] font-bold bg-[var(--color-amber-light)] text-[var(--color-text-primary)] border border-[var(--color-amber)] rounded-none hover:bg-[var(--color-amber)] transition-colors cursor-pointer" title="ختم الأربعين">
                      ختم 40
                    </button>
                    <button (click)="resetStudentProgress(student.id)" class="px-2 py-1 text-[9px] font-bold bg-[var(--color-canvas)] text-[var(--color-text-tertiary)] border border-[var(--color-border)] rounded-none hover:bg-[var(--color-border)] transition-colors cursor-pointer" title="تصفير">
                      تصفير
                    </button>
                  </div>
                </div>
              </div>
              } @empty {
              <div class="col-span-2 text-center py-10 rounded-none bg-[var(--color-canvas)] border border-[var(--color-border-light)]">
                <span class="material-icons text-4xl text-[var(--color-text-tertiary)]">person_off</span>
                <p class="text-[var(--color-text-secondary)] mt-2 font-semibold text-sm">لا يوجد طلاب نشطين</p>
                <button (click)="showAddStudent()" class="sketch-button mt-4 px-5 py-2 text-xs font-semibold cursor-pointer">سجل أول طالب</button>
              </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class StagesComponent {
  state = inject(TrackerState);
  toast = inject(ToastService);
  modal = inject(ModalService);
  celebration = inject(CelebrationService);
  api = inject(ApiService);

  private avatarMap: Record<string, string> = {
    'avatar-leaf': '🌿', 'avatar-mountain': '🏔️', 'avatar-sun': '☀️',
    'avatar-flower': '🌸', 'avatar-water': '💧', 'avatar-shield': '🛡️',
  };

  get totalXP(): number {
    return this.state.students().reduce((sum, s) => sum + s.xp, 0);
  }

  get topStudentName(): string {
    const students = this.state.students();
    if (students.length === 0) return '—';
    return students.reduce((a, b) => (a.xp > b.xp ? a : b)).name;
  }

  getAvatarEmoji(key: string): string {
    return this.avatarMap[key] || '🌿';
  }

  showAddStudent() {
    this.modal.showAddStudent.set(true);
  }

  openEditStudent(student: Student) {
    window.dispatchEvent(new CustomEvent('editStudent', { detail: student }));
    this.modal.showEditStudent.set(true);
  }

  onDeleteStudent(id: string, name: string) {
    this.modal.confirm(`هل أنت متأكد من حذف الطالب (${name})؟ سيتم مسح سجل الحفظ بالكامل.`, () => {
      this.state.deleteStudent(id);
      this.toast.show('تم حذف الطالب من السجل.');
      this.modal.confirmState.set(null);
    });
  }

  cheatUnlockAll(studentId: string) {
    const student = this.state.students().find((s) => s.id === studentId);
    if (!student) return;
    this.modal.confirm(`هل تريد وسم جميع الأحاديث الـ 40 كـ "محفوظة" للطالب (${student.name})؟`, () => {
      const updated = this.state.students().map((s) => {
        if (s.id === studentId) {
          const allNums = Array.from({ length: 40 }, (_, i) => i + 1);
          return { ...s, memorizedHadithNumbers: allNums, reviewHadithNumbers: [], xp: 4000 };
        }
        return s;
      });
      this.state.students.set(updated);
      const saved = updated.find((s) => s.id === studentId);
      if (saved) this.api.saveStudent(saved).catch(() => {});
      const updatedStudent = updated.find((s) => s.id === studentId)!;
      this.celebration.trigger(updatedStudent, STAGES[4]);
      this.toast.show(`هنيئاً! تم إتمام حفظ الأربعين لـ ${updatedStudent.name}!`);
      this.modal.confirmState.set(null);
    });
  }

  resetStudentProgress(studentId: string) {
    const student = this.state.students().find((s) => s.id === studentId);
    if (!student) return;
    this.modal.confirm(`هل تريد تصفير سجل حفظ الطالب (${student.name})؟`, () => {
      const updated = this.state.students().map((s) => {
        if (s.id === studentId) {
          return { ...s, memorizedHadithNumbers: [], reviewHadithNumbers: [], xp: 0 };
        }
        return s;
      });
      this.state.students.set(updated);
      const savedStudent = updated.find((s) => s.id === studentId);
      if (savedStudent) this.api.saveStudent(savedStudent).catch(() => {});
      this.toast.show('تم تصفير سجل الحفظ.');
      this.modal.confirmState.set(null);
    });
  }
}
