import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'hadith',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/hadith-trail/hadith-trail.component').then((m) => m.HadithTrailComponent),
  },
  {
    path: 'quran',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/quran-trail/quran-trail.component').then((m) => m.QuranTrailComponent),
  },
  {
    path: 'english',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/english-trail/english-trail.component').then((m) => m.EnglishTrailComponent),
  },
  {
    path: 'reference',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/reference/reference.component').then((m) => m.ReferenceComponent),
  },
  {
    path: 'stages',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/stages/stages.component').then((m) => m.StagesComponent),
  },
  { path: '**', redirectTo: 'dashboard' },
];
