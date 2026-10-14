import { Routes } from '@angular/router';
import { List } from './features/heroes/components/list/list';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'heroes' },
    { path: 'heroes', component: List },
];
