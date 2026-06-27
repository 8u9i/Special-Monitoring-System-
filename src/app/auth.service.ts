import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);

  /** Has the initial auth check completed? */
  authChecked = signal(false);
  /** Is the user authenticated? */
  authenticated = signal(false);

  async checkAuth(): Promise<boolean> {
    try {
      const res = await fetch('/api/auth/check', { credentials: 'same-origin' });
      const data = await res.json();
      this.authenticated.set(data.authenticated);
      this.authChecked.set(true);
      return data.authenticated;
    } catch {
      this.authenticated.set(false);
      this.authChecked.set(true);
      return false;
    }
  }

  async login(username: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        this.authenticated.set(true);
        return { success: true };
      }
      return { success: false, error: data.error || 'بيانات الدخول غير صحيحة' };
    } catch {
      return { success: false, error: 'خطأ في الاتصال بالخادم' };
    }
  }

  async logout(): Promise<void> {
    await fetch('/api/logout', { method: 'POST', credentials: 'same-origin' });
    this.authenticated.set(false);
    this.router.navigate(['/login']);
  }
}
