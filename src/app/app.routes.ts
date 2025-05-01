import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home', title: 'Redirección inicial'},
  {
    path: 'home',
    loadComponent: () => import('./components/home/home.component'),
    title: 'Inicio'
  },
  {
    path: 'servicios/:serviceType',
    loadComponent: () => import('./components/services-detail/services-detail.component'),
    title: 'Terapias especializadas'
  },
  { path: '**', redirectTo: 'home', title: 'Redirección'}
];
