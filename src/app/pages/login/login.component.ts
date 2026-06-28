import { Component, signal, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { TrackerState } from '../../state';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  template: `
    <div class="login-wrapper">
      <div class="login-card">
        <!-- Logo / Brand -->
        <div class="login-brand">
          <div class="login-icon">
            <span class="material-icons text-white text-3xl">eco</span>
          </div>
          <h1 class="login-title">يا إخوتي</h1>
          <p class="login-subtitle">متابع الحفظ التفاعلي</p>
        </div>

        <!-- Login Form -->
        <form (ngSubmit)="onLogin()" class="login-form">
          <div class="input-group">
            <label for="username">اسم المستخدم</label>
            <div class="input-wrapper">
              <span class="material-icons input-icon">person</span>
              <input
                id="username"
                type="text"
                [(ngModel)]="username"
                name="username"
                placeholder="أدخل اسم المستخدم"
                autocomplete="username"
                autofocus
                [disabled]="loading()"
              />
            </div>
          </div>

          <div class="input-group">
            <label for="password">كلمة المرور</label>
            <div class="input-wrapper">
              <span class="material-icons input-icon">lock</span>
              <input
                id="password"
                [type]="showPassword() ? 'text' : 'password'"
                [(ngModel)]="password"
                name="password"
                placeholder="أدخل كلمة المرور"
                autocomplete="current-password"
                [disabled]="loading()"
              />
              <button
                type="button"
                class="toggle-pass"
                (click)="showPassword.set(!showPassword())"
                tabindex="-1"
              >
                <span class="material-icons">{{ showPassword() ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
          </div>

          @if (error()) {
            <div class="error-msg">
              <span class="material-icons">error_outline</span>
              <span>{{ error() }}</span>
            </div>
          }

          <button type="submit" class="login-btn" [disabled]="loading() || !username || !password">
            @if (loading()) {
              <span class="spinner"></span>
              <span>جاري الدخول...</span>
            } @else {
              <span class="material-icons">login</span>
              <span>تسجيل الدخول</span>
            }
          </button>
        </form>

        <p class="login-footer">بسم الله الرحمن الرحيم</p>
      </div>
    </div>
  `,
  styles: `
    .login-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-canvas);
      padding: 1rem;
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      padding: 2.5rem 2rem;
    }

    .login-brand {
      text-align: center;
      margin-bottom: 2rem;
    }

    .login-icon {
      width: 64px;
      height: 64px;
      background: var(--color-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
    }

    .login-title {
      font-family: var(--font-inter);
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-text-primary);
      margin: 0;
    }

    .login-subtitle {
      font-size: 0.8rem;
      color: var(--color-text-secondary);
      margin-top: 0.25rem;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .input-group label {
      display: block;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin-bottom: 0.4rem;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon {
      position: absolute;
      right: 0.75rem;
      color: var(--color-text-tertiary);
      font-size: 1.2rem;
      pointer-events: none;
    }

    .input-wrapper input {
      width: 100%;
      padding: 0.75rem 2.5rem 0.75rem 0.75rem;
      padding-right: 2.75rem;
      border: 1px solid var(--color-border);
      background: var(--color-canvas);
      font-family: var(--font-tajawal);
      font-size: 0.95rem;
      color: var(--color-text-primary);
      transition: border-color 0.15s;
      min-height: 48px;
    }

    .input-wrapper input:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px var(--color-primary-light);
    }

    .input-wrapper input::placeholder {
      color: var(--color-text-tertiary);
    }

    .toggle-pass {
      position: absolute;
      left: 0.5rem;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--color-text-tertiary);
      padding: 0.25rem;
      min-height: auto;
      display: flex;
      align-items: center;
    }

    .toggle-pass:hover {
      color: var(--color-text-secondary);
    }

    .error-msg {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: var(--color-rose-light);
      border: 1px solid var(--color-rose);
      color: #DC2626;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .error-msg .material-icons {
      font-size: 1.1rem;
    }

    .login-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.85rem;
      background: var(--color-primary);
      color: white;
      border: none;
      font-family: var(--font-tajawal);
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.15s;
      min-height: 48px;
    }

    .login-btn:hover:not(:disabled) {
      background: var(--color-primary-hover);
    }

    .login-btn:active:not(:disabled) {
      transform: scale(0.98);
    }

    .login-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .login-footer {
      text-align: center;
      margin-top: 1.5rem;
      font-size: 0.75rem;
      color: var(--color-text-tertiary);
      font-family: var(--font-amiri);
    }
  `,
})
export class LoginComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private state = inject(TrackerState);

  async ngOnInit() {
    const ok = await this.auth.checkAuth();
    if (ok) {
      await this.state.loadAll();
      this.router.navigate(['/dashboard']);
    }
  }

  username = '';
  password = '';
  loading = signal(false);
  error = signal('');
  showPassword = signal(false);

  async onLogin() {
    if (!this.username || !this.password) return;
    this.loading.set(true);
    this.error.set('');

    const result = await this.auth.login(this.username, this.password);
    this.loading.set(false);

    if (result.success) {
      await this.state.loadAll();
      this.router.navigate(['/dashboard']);
    } else {
      this.error.set(result.error || 'بيانات الدخول غير صحيحة');
    }
  }
}
