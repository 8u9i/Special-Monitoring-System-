import { Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark' | 'auto';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  theme = signal<Theme>('auto');
  isDark = signal(false);

  constructor() {
    this.init();
  }

  private init() {
    // Load saved preference
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved) {
      this.theme.set(saved);
    }

    // Apply theme
    this.applyTheme();

    // Listen for OS theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (this.theme() === 'auto') {
        this.applyTheme();
      }
    });
  }

  setTheme(theme: Theme) {
    this.theme.set(theme);
    localStorage.setItem('theme', theme);
    this.applyTheme();
  }

  toggle() {
    const current = this.theme();
    if (current === 'auto') {
      // If auto, switch to opposite of current OS preference
      const osDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(osDark ? 'light' : 'dark');
    } else {
      this.setTheme(current === 'dark' ? 'light' : 'dark');
    }
  }

  private applyTheme() {
    const body = document.body;
    body.classList.remove('dark', 'light');

    let dark = false;

    if (this.theme() === 'dark') {
      body.classList.add('dark');
      dark = true;
    } else if (this.theme() === 'light') {
      body.classList.add('light');
      dark = false;
    } else {
      // auto — follow OS
      dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (dark) body.classList.add('dark');
      else body.classList.add('light');
    }

    this.isDark.set(dark);

    // Update meta theme-color for mobile browsers
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', dark ? '#0F1117' : '#F8F7F4');
    }
  }
}
