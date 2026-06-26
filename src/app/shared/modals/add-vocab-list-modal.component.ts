import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastService } from '../services/toast.service';
import { ModalService } from '../services/modal.service';
import { TrackerState } from '../../state';

@Component({
  selector: 'app-add-vocab-list-modal',
  imports: [ReactiveFormsModule],
  template: `
    @if (modal.showAddVocabList()) {
    <div class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div class="w-full max-w-lg p-6 bg-[var(--color-surface)] rounded-none border border-[var(--color-border)] max-h-[90vh] overflow-y-auto shadow-xl">
        <div class="flex items-center justify-between mb-5 pb-4 border-b border-[var(--color-border-light)]">
          <h3 class="font-inter text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
            <span class="material-icons text-[var(--color-primary)]">post_add</span>
            Add New Vocabulary List
          </h3>
          <button (click)="modal.showAddVocabList.set(false)" class="w-12 h-12 rounded-none bg-[var(--color-canvas)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] cursor-pointer transition-colors" aria-label="Close">
            <span class="material-icons text-sm">close</span>
          </button>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label for="addVocabName" class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">List Name *</label>
            <input id="addVocabName" type="text" formControlName="name" placeholder="e.g. Unit 1 Vocabulary"
              class="w-full rounded-none border border-[var(--color-border)] bg-[var(--color-canvas)] px-3 py-2.5 text-sm font-semibold focus:outline-none focus:border-[var(--color-primary)] transition-colors" />
            @if (form.get('name')?.invalid && form.get('name')?.touched) {
            <p class="text-[10px] text-red-500 mt-1">List name is required.</p>
            }
          </div>

          <div>
            <label for="addVocabRawText" class="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Words (format: word:definition) *</label>
            <p class="text-[10px] text-[var(--color-text-tertiary)] mb-2">Enter one word per line, separate word and definition with a colon</p>
            <textarea id="addVocabRawText" formControlName="rawText" rows="6" placeholder="apple:a fruit that grows on trees&#10;car:a vehicle with four wheels" dir="ltr"
              class="w-full font-mono text-left rounded-none border border-[var(--color-border)] bg-[var(--color-canvas)] px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"></textarea>
            @if (form.get('rawText')?.invalid && form.get('rawText')?.touched) {
            <p class="text-[10px] text-red-500 mt-1">Text is required (word:definition per line).</p>
            }
          </div>

          <div class="flex items-center gap-3 pt-2">
            <button type="submit" [disabled]="form.invalid"
              class="flex-1 sketch-button py-2.5 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              <span class="material-icons text-sm">check</span>
              Save List
            </button>
            <button type="button" (click)="modal.showAddVocabList.set(false)"
              class="px-4 py-2.5 text-sm font-semibold text-[var(--color-text-secondary)] bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-none hover:bg-[var(--color-surface)] transition-colors cursor-pointer">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
    }
  `,
})
export class AddVocabListModalComponent {
  toast = inject(ToastService);
  modal = inject(ModalService);
  state = inject(TrackerState);

  form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    rawText: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  onSubmit() {
    if (this.form.invalid) return;
    const val = this.form.value;
    this.state.addVocabList(val.name || '', val.rawText || '');
    this.modal.showAddVocabList.set(false);
    this.form.reset();
    this.toast.show('Vocabulary list added successfully!');
  }
}
