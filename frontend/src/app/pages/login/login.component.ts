import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-page">
      <div class="login-card">
        <div class="login-logo">🏠 EMIBNB</div>
        <h2>Connexion</h2>

        <div class="form-group">
          <label>Identifiant</label>
          <input [(ngModel)]="login" placeholder="ex : admin" (keyup.enter)="seConnecter()" />
        </div>
        <div class="form-group">
          <label>Mot de passe</label>
          <input type="password" [(ngModel)]="motDePasse" placeholder="••••••••" (keyup.enter)="seConnecter()" />
        </div>

        <div class="erreur" *ngIf="erreur">{{ erreur }}</div>

        <button class="btn-login" (click)="seConnecter()" [disabled]="!login || !motDePasse">
          Se connecter
        </button>

        <div class="comptes-demo">
          <p>Comptes disponibles :</p>
          <div class="compte" *ngFor="let c of comptes" (click)="remplir(c)">
            <strong>{{ c.login }}</strong> / {{ c.password }}
            <span class="hint">{{ c.nom }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, #fff5f5 0%, #ffe4e9 100%);
    }
    .login-card {
      background: white; border-radius: 20px; padding: 2.5rem;
      box-shadow: 0 8px 32px rgba(255,56,92,.15); width: 100%; max-width: 400px;
    }
    .login-logo {
      font-size: 1.4rem; font-weight: 800; color: #FF385C;
      text-align: center; margin-bottom: 1.5rem;
    }
    h2 { text-align: center; font-size: 1.4rem; margin-bottom: 1.5rem; color: #222; }

    .form-group { margin-bottom: 1.2rem; }
    .form-group label { display: block; font-weight: 600; margin-bottom: .4rem; font-size: .9rem; }
    .form-group input {
      width: 100%; padding: .8rem 1rem; border: 1.5px solid #ddd; border-radius: 10px;
      font-size: 1rem; font-family: inherit; box-sizing: border-box; transition: border .2s;
    }
    .form-group input:focus { outline: none; border-color: #FF385C; }

    .erreur {
      background: #ffe0e0; color: #c0392b; border-radius: 8px;
      padding: .6rem 1rem; margin-bottom: 1rem; font-size: .9rem;
    }

    .btn-login {
      width: 100%; background: #FF385C; color: white; border: none;
      border-radius: 10px; padding: .9rem; font-size: 1rem; font-weight: 700;
      cursor: pointer; transition: background .2s;
    }
    .btn-login:hover:not(:disabled) { background: #e31c5f; }
    .btn-login:disabled { background: #ccc; cursor: not-allowed; }

    .comptes-demo {
      margin-top: 1.8rem; padding-top: 1.2rem; border-top: 1px solid #f0f0f0;
    }
    .comptes-demo p { font-size: .8rem; color: #999; margin-bottom: .7rem; text-align: center; }
    .compte {
      display: flex; justify-content: space-between; align-items: center;
      padding: .5rem .8rem; border-radius: 8px; cursor: pointer;
      transition: background .15s; font-size: .88rem; color: #555;
    }
    .compte:hover { background: #fff5f7; color: #FF385C; }
    .compte strong { color: #333; }
    .hint { font-size: .78rem; color: #aaa; }
  `]
})
export class LoginComponent {
  login = '';
  motDePasse = '';
  erreur = '';

  comptes = [
    { login: 'admin',    password: 'admin',    nom: 'Utilisateur 1' },
    { login: 'khelifi',  password: 'khelifi',  nom: 'Mohamed'       },
    { login: 'mantrach', password: 'mantrach', nom: 'Hamza'         },
    { login: 'gharbi',   password: 'gharbi',   nom: 'Anas'          },
  ];

  constructor(private auth: AuthService, private router: Router) {}

  remplir(c: { login: string; password: string }) {
    this.login = c.login;
    this.motDePasse = c.password;
    this.erreur = '';
  }

  seConnecter() {
    this.erreur = '';
    if (!this.auth.login(this.login, this.motDePasse)) {
      this.erreur = 'Identifiant ou mot de passe incorrect.';
      return;
    }
    this.router.navigate(['/']);
  }
}
