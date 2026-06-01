import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <nav class="navbar" *ngIf="auth.isLoggedIn">
      <div class="navbar-brand">
        <a routerLink="/" class="logo">🏠 AirBnB Clone</a>
      </div>
      <div class="navbar-links">
        <a routerLink="/" class="nav-link">Accueil</a>
        <a routerLink="/activites" class="nav-link">Activités</a>
        <a routerLink="/dashboard" class="nav-link">Dashboard</a>
        <a [routerLink]="['/profil', auth.currentUser!.userId]" class="nav-link btn-profil">
          👤 {{ auth.currentUser!.nom.split(' ')[0] }}
        </a>
        <button class="btn-logout" (click)="auth.logout()">Déconnexion</button>
      </div>
    </nav>
    <main>
      <router-outlet />
    </main>
    <footer class="footer" *ngIf="auth.isLoggedIn">
      <p>© 2024 AirBnB Clone Maroc — Tous droits réservés</p>
    </footer>
  `,
  styles: [`
    .navbar {
      display: flex; justify-content: space-between; align-items: center;
      padding: 1rem 2rem; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,.1);
      position: sticky; top: 0; z-index: 100;
    }
    .logo { font-size: 1.4rem; font-weight: 700; color: #FF385C; text-decoration: none; }
    .navbar-links { display: flex; gap: 1.2rem; align-items: center; }
    .nav-link { color: #333; text-decoration: none; font-weight: 500; transition: color .2s; }
    .nav-link:hover { color: #FF385C; }
    .btn-profil {
      background: #FF385C; color: #fff !important; padding: .5rem 1rem;
      border-radius: 25px; transition: background .2s;
    }
    .btn-profil:hover { background: #e31c5f; }
    .btn-logout {
      background: transparent; border: 1.5px solid #ddd; color: #555;
      border-radius: 25px; padding: .4rem .9rem; cursor: pointer;
      font-size: .85rem; font-weight: 500; transition: all .2s;
    }
    .btn-logout:hover { border-color: #FF385C; color: #FF385C; }
    main { min-height: calc(100vh - 130px); }
    .footer { background: #f7f7f7; text-align: center; padding: 1.5rem;
      color: #717171; font-size: .9rem; border-top: 1px solid #e0e0e0; }
  `]
})
export class AppComponent {
  constructor(public auth: AuthService) {}
}
