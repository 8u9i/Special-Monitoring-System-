import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { TrackerState } from './state';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const state = inject(TrackerState);

  // If we already know we're not authenticated, redirect immediately (no API call)
  if (auth.authenticated() === false) {
    return router.createUrlTree(['/login']);
  }

  const ok = await auth.checkAuth();
  if (ok) {
    // Ensure data is loaded (handles browser refresh on protected pages)
    await state.loadAll();
    return true;
  }
  return router.createUrlTree(['/login']);
};
