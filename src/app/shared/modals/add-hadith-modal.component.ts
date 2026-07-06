import { Component, inject, signal, OnInit, HostListener } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TrackerState } from '../../state';
import { ToastService } from '../services/toast.service';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-add-hadith-modal',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    @if (modal.showAddHadith()) {
    <div class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="addHadithTitle" (click)="close()">
      <div class="modal-panel max-w-lg" (click)="$event.stopPropagation()">
        <div class="flex items-center justify-between mb-5 pb-4 border-b border-[var(--color-border-light)]">
          <h3 id="addHadithTitle" class="font-tajawal text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
            <span class="material-icons text-[var(--color-primary)]">add_box</span>
            إضافة حديث شريف جديد
          </h3>
          <button (click)="modal.showAddHadith.set(false)" class="btn btn-ghost btn-icon" aria-label="إغلاق">
            <span class="material-icons text-sm">close</span>
          </button>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label for="addHadithText" class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">نص الحديث *</label>
            <textarea id="addHadithText" formControlName="text" rows="3" placeholder="نص الحديث..."
              class="input-field font-amiri text-lg text-center"></textarea>
            @if (form.get('text')?.invalid && form.get('text')?.touched) {
            <p class="text-[11px] text-[var(--color-rose)] mt-1">النص مطلوب (5 أحرف على الأقل).</p>
            }
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label for="addHadithCategory" class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">القسم / الباب *</label>
              @if (showNewCategoryInput()) {
              <div class="flex gap-2">
                <input id="addHadithCategory" type="text" formControlName="category" placeholder="اسم التصنيف الجديد"
                  class="input-field flex-1" />
                <button type="button" (click)="useExistingCategory()"
                  class="btn btn-sm border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-canvas)] whitespace-nowrap">
                  اختر من القائمة
                </button>
              </div>
              } @else if (uniqueCategories().length > 0) {
              <div class="flex gap-2">
                <select id="addHadithCategory" formControlName="category"
                  class="input-field flex-1 cursor-pointer">
                  @for (cat of uniqueCategories(); track cat) {
                  <option [value]="cat">{{ cat }}</option>
                  }
                </select>
                <button type="button" (click)="showNewCategoryInput.set(true)"
                  class="btn btn-sm border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-canvas)] whitespace-nowrap">
                  جديد
                </button>
              </div>
              } @else {
              <input id="addHadithCategory" type="text" formControlName="category" placeholder="مثال: الأخلاق والصدق"
                class="input-field" />
              }
            </div>
            <div>
              <label for="addHadithReference" class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">راوي الحديث *</label>
              <input id="addHadithReference" type="text" formControlName="reference" placeholder="مثال: عن أبي هريرة"
                class="input-field" />
            </div>
          </div>

          <div>
            <label for="addHadithExplanation" class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">الشرح والتوجيه التربوي *</label>
            <textarea id="addHadithExplanation" formControlName="explanation" rows="3" placeholder="شرح بسيط لمساعدة الأطفال..."
              class="input-field"></textarea>
          </div>

          <div class="flex items-center gap-3 pt-2">
            <button type="submit" [disabled]="form.invalid"
              class="btn btn-primary btn-md flex-1 disabled:opacity-50 disabled:cursor-not-allowed">
              <span class="material-icons text-sm">check</span>
              إضافة الحديث
            </button>
            <button type="button" (click)="modal.showAddHadith.set(false)"
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
export class AddHadithModalComponent implements OnInit {
  state = inject(TrackerState);
  toast = inject(ToastService);
  modal = inject(ModalService);

  showNewCategoryInput = signal(false);

  form = new FormGroup({
    text: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(5)] }),
    reference: new FormControl('رواه البخاري ومسلم', { nonNullable: true, validators: [Validators.required] }),
    explanation: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    category: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  ngOnInit() {
    const cats = this.uniqueCategories();
    if (cats.length > 0) {
      this.form.patchValue({ category: cats[0] });
    }
  }

  uniqueCategories() {
    const cats = new Set<string>();
    this.state.hadiths().forEach((h) => cats.add(h.category));
    return Array.from(cats);
  }

  useExistingCategory() {
    this.showNewCategoryInput.set(false);
    const cats = this.uniqueCategories();
    if (cats.length > 0) {
      this.form.patchValue({ category: cats[0] });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    const val = this.form.value;
    const cat = val.category || 'عام';
    this.state.addHadith(val.text || '', val.reference || '', val.explanation || '', cat);
    this.modal.showAddHadith.set(false);
    this.form.reset({ reference: 'رواه البخاري ومسلم' });
    this.showNewCategoryInput.set(false);
    this.toast.show('تم إضافة الحديث الشريف بنجاح!');
  }

  close() {
    this.modal.showAddHadith.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.close();
  }
}
