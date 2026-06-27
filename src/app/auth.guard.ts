import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // App shell already blocks rendering until auth is confirmed.
  // Just trust the signal — no redundant API calls on every navigation.
  if (auth.authenticated()) return true;
  return router.createUrlTree(['/login']);
};
