import { Component, inject, signal, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TrackerState } from '../../state';
import { Hadith } from '../../hadith-data';
import { ToastService } from '../services/toast.service';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-edit-hadith-modal',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    @if (modal.showEditHadith()) {
    <div class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="editHadithTitle" (click)="close()">
      <div class="w-full max-w-lg p-6 bg-[var(--color-surface)] rounded-none border border-[var(--color-border)] max-h-[90vh] overflow-y-auto shadow-xl" (click)="$event.stopPropagation()">
        <div class="flex items-center justify-between mb-5 pb-4 border-b border-[var(--color-border-light)]">
          <h3 id="editHadithTitle" class="font-inter text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
            <span class="material-icons text-[var(--color-primary)]">edit_note</span>
            تعديل الحديث رقم {{ form.get('number')?.value }}
          </h3>
          <button (click)="modal.showEditHadith.set(false)" class="w-12 h-12 rounded-none bg-[var(--color-canvas)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] cursor-pointer transition-colors" aria-label="إغلاق">
            <span class="material-icons text-sm">close</span>
          </button>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label for="editHadithNumber" class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">رقم الحديث *</label>
            <input id="editHadithNumber" type="number" formControlName="number" min="1"
              class="w-full rounded-none border border-[var(--color-border)] bg-[var(--color-canvas)] px-3 py-2.5 text-sm font-semibold focus:outline-none focus:border-[var(--color-primary)] transition-colors" />
          </div>

          <div>
            <label for="editHadithText" class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">نص الحديث *</label>
            <textarea id="editHadithText" formControlName="text" rows="3"
              class="w-full font-amiri text-lg text-center rounded-none border border-[var(--color-border)] bg-[var(--color-canvas)] px-3 py-2.5 focus:outline-none focus:border-[var(--color-primary)] transition-colors"></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label for="editHadithCategory" class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">القسم / الباب *</label>
              @if (showNewCategory()) {
              <div class="flex gap-2">
                <input id="editHadithCategory" type="text" formControlName="category" placeholder="اسم التصنيف الجديد"
                  class="flex-1 rounded-none border border-[var(--color-border)] bg-[var(--color-canvas)] px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors" />
                <button type="button" (click)="showNewCategory.set(false)"
                  class="px-2 py-2 text-[10px] font-semibold bg-[var(--color-surface)] border border-[var(--color-border)] rounded-none hover:bg-[var(--color-canvas)] cursor-pointer whitespace-nowrap">
                  اختر من القائمة
                </button>
              </div>
              } @else {
              <div class="flex gap-2">
                <select id="editHadithCategory" formControlName="category"
                  class="flex-1 rounded-none border border-[var(--color-border)] bg-[var(--color-canvas)] px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors cursor-pointer">
                  @for (cat of uniqueCategories(); track cat) {
                  <option [value]="cat">{{ cat }}</option>
                  }
                </select>
                <button type="button" (click)="startNewCategory()"
                  class="px-2 py-2 text-[10px] font-semibold bg-[var(--color-surface)] border border-[var(--color-border)] rounded-none hover:bg-[var(--color-canvas)] cursor-pointer whitespace-nowrap">
                  جديد
                </button>
              </div>
              }
            </div>
            <div>
              <label for="editHadithReference" class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">راوي الحديث *</label>
              <input id="editHadithReference" type="text" formControlName="reference" placeholder="مثال: عن أبي هريرة"
                class="w-full rounded-none border border-[var(--color-border)] bg-[var(--color-canvas)] px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors" />
            </div>
          </div>

          <div>
            <label for="editHadithExplanation" class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">الشرح والتوجيه *</label>
            <textarea id="editHadithExplanation" formControlName="explanation" rows="3"
              class="w-full rounded-none border border-[var(--color-border)] bg-[var(--color-canvas)] px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"></textarea>
          </div>

          <div class="pt-3 border-t border-[var(--color-border-light)]">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label for="editHadithBadgeName" class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">اسم وسام التميز</label>
                <input id="editHadithBadgeName" type="text" formControlName="badgeName"
                  class="w-full rounded-none border border-[var(--color-border)] bg-[var(--color-canvas)] px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors" />
              </div>
              <div>
                <span class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">أيقونة الوسام</span>
                <div class="grid grid-cols-4 gap-1.5">
                  @for (icon of ['stars', 'favorite', 'spa', 'workspace_premium']; track icon) {
                  <label [class]="form.get('badgeIcon')?.value === icon
                    ? 'flex items-center justify-center p-2 rounded-none bg-[var(--color-primary-light)] border border-[var(--color-primary)] cursor-pointer'
                    : 'flex items-center justify-center p-2 rounded-none bg-[var(--color-canvas)] border border-[var(--color-border)] hover:border-[var(--color-primary)] cursor-pointer'">
                    <input type="radio" formControlName="badgeIcon" [value]="icon" class="sr-only" />
                    <span class="material-icons text-base text-[var(--color-text-secondary)]">{{ icon }}</span>
                  </label>
                  }
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3 pt-2">
            <button type="submit" [disabled]="form.invalid"
              class="flex-1 sketch-button py-2.5 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              <span class="material-icons text-sm">check</span>
              حفظ التعديلات
            </button>
            <button type="button" (click)="modal.showEditHadith.set(false)"
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
    badgeName: new FormControl('', { nonNullable: true }),
    badgeIcon: new FormControl('', { nonNullable: true }),
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
      badgeName: hadith.badgeName || '',
      badgeIcon: hadith.badgeIcon || 'stars',
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
    const cat = val.category || '';
    const success = this.state.updateHadith(
      this.selectedHadithForEdit()?.number ?? 0,
      val.number || 0,
      cat,
      val.text || '',
      val.reference || '',
      val.explanation || '',
      val.category || '',
      val.badgeName || undefined,
      val.badgeIcon || undefined,
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
