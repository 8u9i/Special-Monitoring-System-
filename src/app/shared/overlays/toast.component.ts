import { Component, inject } from '@angular/core';
import { ToastService } from '../services/toast.service';

import { AppIconComponent } from '../../shared/components/app-icon/app-icon.component';

@Component({
  selector: 'app-toast',
    imports: [AppIconComponent],
  template: `
    @if (toast.message(); as msg) {
    <button (click)="toast.message.set(null)" class="fixed bottom-6 right-6 z-50 px-5 py-3 bg-[var(--color-primary-dark)] text-white shadow-lg flex items-center gap-3 cursor-pointer border-none" aria-label="إخفاء الإشعار" role="alert" aria-live="polite">
      @if (toast.type() === 'error') {
        <app-icon name="error" [size]="18"></app-icon>
      } @else {
        <app-icon name="check_circle" [size]="18"></app-icon>
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
