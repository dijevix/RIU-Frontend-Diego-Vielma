import { Routes } from '@angular/router';
import { List } from './features/heroes/components/list/list';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'heroes' },
  { path: 'heroes', component: List },
  {
    path: 'heroes/:id',
    loadComponent: () =>
      import('./features/heroes/components/hero-detail/hero-detail').then((m) => m.HeroDetail),
  },
];
