import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'hadith',
    loadComponent: () =>
      import('./pages/hadith-trail/hadith-trail.component').then((m) => m.HadithTrailComponent),
  },
  {
    path: 'quran',
    loadComponent: () =>
      import('./pages/quran-trail/quran-trail.component').then((m) => m.QuranTrailComponent),
  },
  {
    path: 'english',
    loadComponent: () =>
      import('./pages/english-trail/english-trail.component').then((m) => m.EnglishTrailComponent),
  },
  {
    path: 'reference',
    loadComponent: () =>
      import('./pages/reference/reference.component').then((m) => m.ReferenceComponent),
  },
  {
    path: 'stages',
    loadComponent: () =>
      import('./pages/stages/stages.component').then((m) => m.StagesComponent),
  },
  { path: '**', redirectTo: 'dashboard' },
];
