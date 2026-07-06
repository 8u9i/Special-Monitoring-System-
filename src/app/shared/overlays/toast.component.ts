import { Component, inject } from '@angular/core';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toast',
  template: `
    @if (toast.message(); as msg) {
    <button (click)="toast.message.set(null)" class="fixed bottom-6 right-6 z-50 px-5 py-3 bg-[var(--color-primary-dark)] text-white shadow-lg flex items-center gap-3 cursor-pointer border-none" aria-label="إخفاء الإشعار" role="alert" aria-live="polite">
      @if (toast.type() === 'error') {
        <span class="material-icons text-[var(--color-rose)] text-lg">error</span>
      } @else {
        <span class="material-icons text-[var(--color-green)] text-lg">check_circle</span>
      }
      <span class="text-sm font-semibold">{{ msg }}</span>
      <span class="material-icons text-[var(--color-text-tertiary)] text-base mr-2" aria-hidden="true">close</span>
    </button>
    }
  `,
})
export class ToastComponent {
  toast = inject(ToastService);
}
