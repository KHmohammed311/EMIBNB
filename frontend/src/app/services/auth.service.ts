import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface AuthUser {
  userId: string;
  nom: string;
  login: string;
}

const USERS: Array<AuthUser & { password: string }> = [
  { login: 'admin',    password: 'admin',    userId: '665f000000000000000000a1', nom: 'Utilisateur 1' },
  { login: 'khelifi',  password: 'khelifi',  userId: '665f000000000000000000a3', nom: 'Mohamed'       },
  { login: 'mantrach', password: 'mantrach', userId: '665f000000000000000000a4', nom: 'Hamza'         },
  { login: 'gharbi',   password: 'gharbi',   userId: '665f000000000000000000a5', nom: 'Anas'          },
];

const KEY = 'airbnb_user';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private router: Router) {}

  login(login: string, password: string): boolean {
    const match = USERS.find(u => u.login === login && u.password === password);
    if (!match) return false;
    const { password: _, ...user } = match;
    localStorage.setItem(KEY, JSON.stringify(user));
    return true;
  }

  logout(): void {
    localStorage.removeItem(KEY);
    this.router.navigate(['/login']);
  }

  get currentUser(): AuthUser | null {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  }

  get isLoggedIn(): boolean {
    return !!this.currentUser;
  }
}
