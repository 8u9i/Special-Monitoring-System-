import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ModalService {
  readonly showAddStudent = signal(false);
  readonly showEditStudent = signal(false);
  readonly showAddHadith = signal(false);
  readonly showEditHadith = signal(false);
  readonly confirmState = signal<{
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  confirm(message: string, onConfirm: () => void) {
    this.confirmState.set({ isOpen: true, message, onConfirm });
  }
}
