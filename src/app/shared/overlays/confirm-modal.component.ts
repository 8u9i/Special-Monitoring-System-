import { Component, inject, HostListener } from '@angular/core';
import { ModalService } from '../services/modal.service';

import { AppIconComponent } from '../../shared/components/app-icon/app-icon.component';

@Component({
  selector: 'app-confirm-modal',
    imports: [AppIconComponent],
  template: `
    @if (modal.confirmState()) {
    <div class="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="confirmTitle" (click)="close()">
      <div class="modal-panel max-w-sm text-center" (click)="$event.stopPropagation()">
        <div class="w-14 h-14 bg-[var(--color-rose-light)] text-[var(--color-rose)] mx-auto flex items-center justify-center mb-4">
          <app-icon name="warning" [size]="20"></app-icon>
        </div>
        <h3 id="confirmTitle" class="font-tajawal font-bold text-lg text-[var(--color-text-primary)] mb-2">تأكيد الإجراء</h3>
        <p class="text-sm text-[var(--color-text-secondary)] mb-6 leading-relaxed">
          {{ modal.confirmState()!.message }}
        </p>
        <div class="flex gap-3 w-full">
          <button (click)="modal.confirmState.set(null)"
            class="btn btn-outline btn-md flex-1">
            إلغاء
          </button>
          <button (click)="modal.confirmState()!.onConfirm()"
            class="btn btn-md flex-1 bg-[var(--color-rose)] text-white hover:bg-[var(--color-rose-hover)]">
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

  close() {
    this.modal.confirmState.set(null);
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.close();
  }
}
