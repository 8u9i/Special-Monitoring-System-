import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly message = signal<string | null>(null);
  readonly type = signal<'success' | 'error'>('success');
  private timeout: ReturnType<typeof setTimeout> | undefined;

  show(msg: string, type: 'success' | 'error' = 'success') {
    clearTimeout(this.timeout);
    this.message.set(msg);
    this.type.set(type);
    this.timeout = setTimeout(() => this.message.set(null), 4000);
  }
}
