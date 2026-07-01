import { Component, inject, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { TrackerState, Student } from '../../state';
import { ToastService } from '../services/toast.service';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-edit-student-modal',
  imports: [ReactiveFormsModule],
  template: `
    @if (modal.showEditStudent()) {
    <div class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="editStudentTitle" (click)="close()">
      <div class="w-full max-w-md p-6 bg-[var(--color-surface)] rounded-none border border-[var(--color-border)] max-h-[90vh] overflow-y-auto shadow-xl" (click)="$event.stopPropagation()">
        <div class="flex items-center justify-between mb-5 pb-4 border-b border-[var(--color-border-light)]">
          <h3 id="editStudentTitle" class="font-tajawal text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
            <span class="material-icons text-[var(--color-primary)]">edit</span>
            تعديل بيانات الطالب
          </h3>
          <button (click)="modal.showEditStudent.set(false)" class="w-12 h-12 rounded-none bg-[var(--color-canvas)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] cursor-pointer transition-colors" aria-label="إغلاق">
            <span class="material-icons text-sm">close</span>
          </button>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <input type="hidden" formControlName="id" />

          <div>
            <label for="input-edit-name" class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">اسم الطالب *</label>
            <input id="input-edit-name" type="text" formControlName="name" placeholder="مثال: يوسف محمد العلي"
              class="w-full rounded-none border border-[var(--color-border)] bg-[var(--color-canvas)] px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors" />
            @if (form.get('name')?.invalid && form.get('name')?.touched) {
            <p class="text-[11px] text-red-500 mt-1">الاسم مطلوب (حرفان على الأقل).</p>
            }
          </div>

          <div>
            <label for="input-edit-age" class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">العمر (سنوات)</label>
            <input id="input-edit-age" type="number" formControlName="age" placeholder="مثال: 9"
              class="w-full rounded-none border border-[var(--color-border)] bg-[var(--color-canvas)] px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors" />
          </div>

          <div>
            <span class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-2">شعار الطالب</span>
            <div class="grid grid-cols-3 gap-2">
              @for (opt of avatarOptions; track opt.key) {
              <label [class]="form.get('avatar')?.value === opt.key
                ? 'flex flex-col items-center p-3 rounded-none bg-[var(--color-primary-light)] border border-[var(--color-primary)] cursor-pointer transition-all'
                : 'flex flex-col items-center p-3 rounded-none bg-[var(--color-canvas)] border border-[var(--color-border)] hover:border-[var(--color-primary)] cursor-pointer transition-all'">
                <input type="radio" formControlName="avatar" [value]="opt.key" class="sr-only" />
                <span class="text-2xl mb-1 select-none">{{ opt.emoji }}</span>
                <span class="text-[11px] font-semibold text-[var(--color-text-secondary)]">{{ opt.label }}</span>
              </label>
              }
            </div>
          </div>

          <div>
            <label for="textarea-edit-notes" class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">ملاحظات</label>
            <textarea id="textarea-edit-notes" formControlName="notes" rows="3" placeholder="ملاحظات توجيهية..."
              class="w-full rounded-none border border-[var(--color-border)] bg-[var(--color-canvas)] px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"></textarea>
          </div>

          <div class="flex items-center gap-3 pt-2">
            <button type="submit" [disabled]="form.invalid"
              class="flex-1 sketch-button py-2.5 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              <span class="material-icons text-sm">check</span>
              حفظ التعديلات
            </button>
            <button type="button" (click)="modal.showEditStudent.set(false)"
              class="px-4 py-2.5 text-sm font-semibold text-[var(--color-text-secondary)] bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-none hover:bg-[var(--color-surface)] transition-colors cursor-pointer">
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
    }
  `,
})
export class EditStudentModalComponent implements OnInit, OnDestroy {
  state = inject(TrackerState);
  toast = inject(ToastService);
  modal = inject(ModalService);

  private listener = ((e: CustomEvent) => this.open(e.detail)) as EventListener;

  ngOnInit() {
    if (typeof window !== 'undefined') {
      window.addEventListener('editStudent', this.listener);
    }
  }

  ngOnDestroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('editStudent', this.listener);
    }
  }

  form = new FormGroup({
    id: new FormControl('', { nonNullable: true }),
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    age: new FormControl<number | null>(null),
    avatar: new FormControl('avatar-leaf', { nonNullable: true }),
    notes: new FormControl(''),
  });

  avatarOptions = [
    { key: 'avatar-leaf', emoji: '🌿', label: 'غصن أخضر' },
    { key: 'avatar-mountain', emoji: '🏔️', label: 'جبل الحكمة' },
    { key: 'avatar-sun', emoji: '☀️', label: 'شمس الهداية' },
    { key: 'avatar-flower', emoji: '🌸', label: 'زهرة الأخلاق' },
    { key: 'avatar-water', emoji: '💧', label: 'غيث المعرفة' },
    { key: 'avatar-shield', emoji: '🛡️', label: 'درع العقيدة' },
  ];

  open(student: Student) {
    this.form.setValue({
      id: student.id,
      name: student.name,
      age: student.age || null,
      avatar: student.avatar,
      notes: student.notes || '',
    });
    this.modal.showEditStudent.set(true);
  }

  onSubmit() {
    if (this.form.invalid) return;
    const val = this.form.value;
    this.state.updateStudent(val.id || '', val.name || '', val.age || undefined, val.avatar || 'avatar-leaf', val.notes || '');
    this.modal.showEditStudent.set(false);
    this.toast.show('تم تحديث بيانات الطالب بنجاح!');
  }

  close() {
    this.modal.showEditStudent.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.close();
  }
}
