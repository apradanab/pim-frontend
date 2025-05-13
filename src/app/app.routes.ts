import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home', title: 'Redirección inicial'},
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component'),
    title: 'Psicología infantojuvenil Montcada - Inicio'
  },
  {
    path: 'servicios/:serviceType',
    loadComponent: () => import('./features/services-detail/services-detail.component'),
    title: 'Terapias especializadas'
  },
  { path: '**', redirectTo: 'home', title: 'Redirección'}
];
