import { Component, inject, signal, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TrackerState } from '../../state';
import { Hadith } from '../../hadith-data';
import { ToastService } from '../services/toast.service';
import { ModalService } from '../services/modal.service';

import { AppIconComponent } from '../../shared/components/app-icon/app-icon.component';

@Component({
  selector: 'app-edit-hadith-modal',
  imports: [CommonModule, ReactiveFormsModule, AppIconComponent],
  template: `
    @if (modal.showEditHadith()) {
    <div class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="editHadithTitle" (click)="close()">
      <div class="modal-panel max-w-lg" (click)="$event.stopPropagation()">
        <div class="flex items-center justify-between mb-5 pb-4 border-b border-[var(--color-border-light)]">
          <h3 id="editHadithTitle" class="font-tajawal text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
            <app-icon name="edit_note" [size]="18"></app-icon>
            تعديل الحديث رقم {{ form.get('number')?.value }}
          </h3>
          <button (click)="modal.showEditHadith.set(false)" class="btn btn-ghost btn-icon" aria-label="إغلاق">
            <app-icon name="close" [size]="18"></app-icon>
          </button>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label for="editHadithNumber" class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">رقم الحديث *</label>
            <input id="editHadithNumber" type="number" formControlName="number" min="1"
              class="input-field" />
          </div>

          <div>
            <label for="editHadithText" class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">نص الحديث *</label>
            <textarea id="editHadithText" formControlName="text" rows="3"
              class="input-field font-amiri text-lg text-center"></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label for="editHadithCategory" class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">القسم / الباب *</label>
              @if (showNewCategory()) {
              <div class="flex gap-2">
                <input id="editHadithCategory" type="text" formControlName="category" placeholder="اسم التصنيف الجديد"
                  class="input-field flex-1" />
                <button type="button" (click)="showNewCategory.set(false)"
                  class="btn btn-sm border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-canvas)] whitespace-nowrap">
                  اختر من القائمة
                </button>
              </div>
              } @else {
              <div class="flex gap-2">
                <select id="editHadithCategory" formControlName="category"
                  class="input-field flex-1 cursor-pointer">
                  @for (cat of uniqueCategories(); track cat) {
                  <option [value]="cat">{{ cat }}</option>
                  }
                </select>
                <button type="button" (click)="startNewCategory()"
                  class="btn btn-sm border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-canvas)] whitespace-nowrap">
                  جديد
                </button>
              </div>
              }
            </div>
            <div>
              <label for="editHadithReference" class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">راوي الحديث *</label>
              <input id="editHadithReference" type="text" formControlName="reference" placeholder="مثال: عن أبي هريرة"
                class="input-field" />
            </div>
          </div>

          <div>
            <label for="editHadithExplanation" class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">الشرح والتوجيه *</label>
            <textarea id="editHadithExplanation" formControlName="explanation" rows="3"
              class="input-field"></textarea>
          </div>

          <div class="flex items-center gap-3 pt-2">
            <button type="submit" [disabled]="form.invalid"
              class="btn btn-primary btn-md flex-1 disabled:opacity-50 disabled:cursor-not-allowed">
              <app-icon name="check" [size]="18"></app-icon>
              حفظ التعديلات
            </button>
            <button type="button" (click)="modal.showEditHadith.set(false)"
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
export class EditHadithModalComponent implements OnInit, OnDestroy {
  state = inject(TrackerState);
  toast = inject(ToastService);
  modal = inject(ModalService);

  showNewCategory = signal(false);

  private listener = ((e: CustomEvent) => this.open(e.detail)) as EventListener;

  ngOnInit() {
    if (typeof window !== 'undefined') {
      window.addEventListener('editHadith', this.listener);
    }
  }

  ngOnDestroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('editHadith', this.listener);
    }
  }

  selectedHadithForEdit = signal<Hadith | null>(null);

  form = new FormGroup({
    number: new FormControl<number>(0, { nonNullable: true, validators: [Validators.required] }),
    text: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(5)] }),
    reference: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    explanation: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    category: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  uniqueCategories() {
    const cats = new Set<string>();
    this.state.hadiths().forEach((h) => cats.add(h.category));
    return Array.from(cats);
  }

  open(hadith: Hadith) {
    this.selectedHadithForEdit.set(hadith);
    this.showNewCategory.set(false);
    this.form.setValue({
      number: hadith.number,
      text: hadith.text,
      reference: hadith.reference,
      explanation: hadith.explanation,
      category: hadith.category,
    });
    this.modal.showEditHadith.set(true);
  }

  startNewCategory() {
    this.showNewCategory.set(true);
    this.form.patchValue({ category: '' });
  }

  onSubmit() {
    if (this.form.invalid) return;
    const val = this.form.value;
    const success = this.state.updateHadith(
      this.selectedHadithForEdit()?.number ?? 0,
      val.number || 0,
      val.text || '',
      val.reference || '',
      val.explanation || '',
      val.category || '',
    );
    this.modal.showEditHadith.set(false);
    if (success) {
      this.toast.show('تم تحديث الحديث الشريف بنجاح!');
    } else {
      this.toast.show('فشل التحديث — ربما الرقم مستخدم مسبقاً.');
    }
  }

  close() {
    this.modal.showEditHadith.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.close();
  }
}
