import { Component, inject } from '@angular/core';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-confirm-modal',
  template: `
    @if (modal.confirmState()) {
    <div class="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div class="w-full max-w-sm p-6 bg-[var(--color-surface)] rounded-none border border-[var(--color-border)] text-center shadow-xl">
        <div class="w-14 h-14 rounded-none bg-red-50 text-red-500 mx-auto flex items-center justify-center mb-4">
          <span class="material-icons text-2xl">warning</span>
        </div>
        <h3 class="font-inter font-bold text-lg text-[var(--color-text-primary)] mb-2">تأكيد الإجراء</h3>
        <p class="text-sm text-[var(--color-text-secondary)] mb-6 leading-relaxed">
          {{ modal.confirmState()!.message }}
        </p>
        <div class="flex gap-3 w-full">
          <button (click)="modal.confirmState.set(null)"
            class="flex-1 py-2.5 text-sm font-semibold bg-[var(--color-canvas)] border border-[var(--color-border)] text-[var(--color-text-secondary)] rounded-none hover:bg-[var(--color-border)] transition-colors cursor-pointer">
            إلغاء
          </button>
          <button (click)="modal.confirmState()!.onConfirm()"
            class="flex-1 py-2.5 text-sm font-semibold bg-red-500 text-white rounded-none hover:bg-red-600 transition-colors cursor-pointer">
            تأكيد
          </button>
        </div>
      </div>
    </div>
    }
  `,
})
export class ConfirmModalComponent {
  modal = inject(ModalService);
}
