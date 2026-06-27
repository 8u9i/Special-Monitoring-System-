import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // If we already know we're not authenticated, redirect immediately (no API call)
  if (auth.authenticated() === false) {
    return router.createUrlTree(['/login']);
  }

  const ok = await auth.checkAuth();
  if (ok) return true;
  return router.createUrlTree(['/login']);
};
