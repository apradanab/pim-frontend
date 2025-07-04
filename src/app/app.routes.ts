import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home', title: 'Redirección inicial'},
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component'),
    title: 'Psicología infantojuvenil Montcada - Inicio'
  },
  {
    path: 'terapias/:therapyType',
    loadComponent: () => import('./features/therapies-view/therapies-view.component'),
    title: 'Terapias especializadas'
  },
  {
    path: 'consejos',
    loadComponent: () => import('./features/advices-view/advices-view.component'),
    title: 'Consejos profesionales'
  },
  { path: '**', redirectTo: 'home', title: 'Redirección'}
];
