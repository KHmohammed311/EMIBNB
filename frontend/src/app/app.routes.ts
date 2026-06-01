import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/accueil/accueil.component').then(m => m.AccueilComponent)
  },
  {
    path: 'annonces/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/detail-annonce/detail-annonce.component').then(m => m.DetailAnnonceComponent)
  },
  {
    path: 'reserver/:annonceId',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/reservation/reservation.component').then(m => m.ReservationComponent)
  },
  {
    path: 'profil/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/profil/profil.component').then(m => m.ProfilComponent)
  },
  {
    path: 'activites',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/activites/activites.component').then(m => m.ActivitesComponent)
  },
  {
    path: 'activites/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/detail-activite/detail-activite.component').then(m => m.DetailActiviteComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  { path: '**', redirectTo: '' }
];
