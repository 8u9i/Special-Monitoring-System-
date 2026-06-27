import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { TrackerState } from './state';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const state = inject(TrackerState);

  // If we already confirmed not authenticated, redirect immediately
  if (auth.authChecked() && !auth.authenticated()) {
    return router.createUrlTree(['/login']);
  }

  const ok = await auth.checkAuth();
  if (ok) {
    await state.loadAll();
    return true;
  }
  return router.createUrlTree(['/login']);
};
