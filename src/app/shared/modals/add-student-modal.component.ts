import { Component, inject, HostListener } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { TrackerState } from '../../state';
import { ToastService } from '../services/toast.service';
import { ModalService } from '../services/modal.service';
import { AVATAR_OPTIONS } from '../constants/avatars';

@Component({
  selector: 'app-add-student-modal',
  imports: [ReactiveFormsModule],
  template: `
    @if (modal.showAddStudent()) {
    <div class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="addStudentTitle" (click)="close()">
      <div class="modal-panel max-w-md" (click)="$event.stopPropagation()">
        <div class="flex items-center justify-between mb-5 pb-4 border-b border-[var(--color-border-light)]">
          <h3 id="addStudentTitle" class="font-tajawal text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
            <span class="material-icons text-[var(--color-primary)]">person_add</span>
            تسجيل طالب جديد
          </h3>
          <button (click)="modal.showAddStudent.set(false)" class="btn btn-ghost btn-icon" aria-label="إغلاق">
            <span class="material-icons text-sm">close</span>
          </button>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label for="input-add-name" class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">اسم الطالب *</label>
            <input id="input-add-name" type="text" formControlName="name" placeholder="مثال: يوسف محمد العلي"
              class="input-field" />
            @if (form.get('name')?.invalid && form.get('name')?.touched) {
            <p class="text-[11px] text-[var(--color-rose)] mt-1">الاسم مطلوب (حرفان على الأقل).</p>
            }
          </div>

          <div>
            <label for="input-add-age" class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">العمر (سنوات)</label>
            <input id="input-add-age" type="number" formControlName="age" placeholder="مثال: 9"
              class="input-field" />
          </div>

          <div>
            <span class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-2">شعار الطالب</span>
            <div class="grid grid-cols-3 gap-2">
              @for (opt of avatarOptions; track opt.key) {
              <label [class]="form.get('avatar')?.value === opt.key
                ? 'avatar-option selected'
                : 'avatar-option'">
                <input type="radio" formControlName="avatar" [value]="opt.key" class="sr-only" />
                <span class="text-2xl mb-1 select-none">{{ opt.emoji }}</span>
                <span class="text-[11px] font-semibold text-[var(--color-text-secondary)]">{{ opt.label }}</span>
              </label>
              }
            </div>
          </div>

          <div>
            <label for="textarea-add-notes" class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">ملاحظات</label>
            <textarea id="textarea-add-notes" formControlName="notes" rows="3" placeholder="ملاحظات توجيهية..."
              class="input-field"></textarea>
          </div>

          <div class="flex items-center gap-3 pt-2">
            <button type="submit" [disabled]="form.invalid"
              class="btn btn-primary btn-md flex-1 disabled:opacity-50 disabled:cursor-not-allowed">
              <span class="material-icons text-sm">check</span>
              تسجيل الطالب
            </button>
            <button type="button" (click)="modal.showAddStudent.set(false)"
              class="btn btn-outline btn-md">
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
    }
  `,
})
export class AddStudentModalComponent {
  state = inject(TrackerState);
  toast = inject(ToastService);
  modal = inject(ModalService);

  form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    age: new FormControl<number | null>(null),
    avatar: new FormControl('avatar-leaf', { nonNullable: true }),
    notes: new FormControl(''),
  });

  avatarOptions = AVATAR_OPTIONS;

  onSubmit() {
    if (this.form.invalid) return;
    const val = this.form.value;
    this.state.addStudent(val.name || '', val.age || undefined, val.avatar || 'avatar-leaf', val.notes || '');
    this.modal.showAddStudent.set(false);
    this.form.reset({ avatar: 'avatar-leaf' });
    this.toast.show('تم إضافة الطالب بنجاح!');
  }

  close() {
    this.modal.showAddStudent.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.close();
  }
}
