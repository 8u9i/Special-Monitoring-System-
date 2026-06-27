import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  authenticated = signal<boolean | null>(null); // null = unknown

  async checkAuth(): Promise<boolean> {
    try {
      const res = await fetch('/api/auth/check', { credentials: 'same-origin' });
      const data = await res.json();
      this.authenticated.set(data.authenticated);
      return data.authenticated;
    } catch {
      this.authenticated.set(false);
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
