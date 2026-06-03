import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-statistiques',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="stats-page">
      <div class="stats-header">
        <h1>📊 Statistiques de la plateforme</h1>
        <p class="subtitle">Vue d'ensemble — données en temps réel depuis MongoDB</p>
      </div>

      <div *ngIf="chargement" class="chargement">Chargement des données...</div>

      <div *ngIf="!chargement" class="stats-content">

        <!-- KPIs -->
        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-val">{{ totalReservations }}</div>
            <div class="kpi-label">Réservations totales</div>
          </div>
          <div class="kpi-card accent">
            <div class="kpi-val">{{ revenuTotal | number }} MAD</div>
            <div class="kpi-label">Revenu global (confirmées + terminées)</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-val">{{ prixParVille.length }}</div>
            <div class="kpi-label">Villes couvertes</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-val">{{ topAnnonces.length }}</div>
            <div class="kpi-label">Annonces notées</div>
          </div>
        </div>

        <div class="charts-grid">
          <!-- Prix moyen par ville -->
          <div class="chart-card">
            <h2>Prix moyen par nuit (MAD) — par ville</h2>
            <div class="bar-chart">
              <div *ngFor="let v of prixParVille" class="bar-row">
                <span class="bar-label">{{ v.ville }}</span>
                <div class="bar-wrap">
                  <div class="bar" [style.width]="pct(v.prixMoyen, maxPrix) + '%'">
                    <span class="bar-val">{{ v.prixMoyen | number:'1.0-0' }} MAD</span>
                  </div>
                </div>
                <span class="bar-count">{{ v.nbAnnonces }} ann.</span>
              </div>
            </div>
          </div>

          <!-- Réservations par statut -->
          <div class="chart-card">
            <h2>Réservations par statut</h2>
            <div class="statut-list">
              <div *ngFor="let s of reservationsParStatut" class="statut-row">
                <span class="statut-badge" [class]="s.statut">{{ statutFr(s.statut) }}</span>
                <div class="statut-bar-wrap">
                  <div class="statut-bar" [style.width]="pct(s.total, maxStatut) + '%'"></div>
                </div>
                <span class="statut-count">{{ s.total }}</span>
                <span class="statut-revenu" *ngIf="s.revenuTotal">{{ s.revenuTotal | number:'1.0-0' }} MAD</span>
              </div>
            </div>
          </div>

          <!-- Top annonces -->
          <div class="chart-card wide">
            <h2>🏆 Top annonces les mieux notées</h2>
            <div class="top-list">
              <div *ngFor="let a of topAnnonces; let i = index" class="top-row">
                <span class="top-rank">#{{ i + 1 }}</span>
                <div class="top-info">
                  <strong>{{ a.titre }}</strong>
                  <span class="top-meta">{{ a.ville }} · {{ a.type }} · {{ a.prixParNuit | number }} MAD/nuit</span>
                </div>
                <div class="top-note">
                  <span class="note-stars">⭐ {{ a.noteMoyenne }}</span>
                  <span class="note-count">({{ a.nbAvis }} avis)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-page { max-width:1200px; margin:0 auto; padding:2rem; }
    .stats-header { margin-bottom:2rem; }
    .stats-header h1 { font-size:1.8rem; }
    .subtitle { color:#717171; margin-top:.3rem; }
    .chargement { text-align:center; padding:3rem; color:#717171; }

    .kpi-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1rem; margin-bottom:2rem; }
    .kpi-card { background:white; border:1px solid #eee; border-radius:12px;
      padding:1.5rem; text-align:center; box-shadow:0 2px 8px rgba(0,0,0,.06); }
    .kpi-card.accent { background:#FF385C; color:white; }
    .kpi-card.accent .kpi-val { color:white; }
    .kpi-val { font-size:1.6rem; font-weight:700; color:#FF385C; }
    .kpi-label { color:#717171; font-size:.85rem; margin-top:.3rem; }
    .kpi-card.accent .kpi-label { color:rgba(255,255,255,.8); }

    .charts-grid { display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; }
    .chart-card { background:white; border:1px solid #eee; border-radius:16px;
      padding:1.5rem; box-shadow:0 2px 8px rgba(0,0,0,.06); }
    .chart-card.wide { grid-column:span 2; }
    .chart-card h2 { font-size:1rem; margin-bottom:1.2rem; color:#333; }

    /* Barres */
    .bar-row { display:grid; grid-template-columns:90px 1fr 60px; gap:.5rem;
      align-items:center; margin-bottom:.6rem; }
    .bar-label { font-size:.85rem; font-weight:600; color:#444; }
    .bar-wrap { background:#f7f7f7; border-radius:20px; height:22px; overflow:hidden; }
    .bar { background:linear-gradient(90deg,#FF385C,#ff6b35); height:100%;
      border-radius:20px; display:flex; align-items:center; min-width:40px;
      transition:width .5s; }
    .bar-val { font-size:.72rem; font-weight:700; color:white; padding:0 .5rem; white-space:nowrap; }
    .bar-count { font-size:.8rem; color:#888; text-align:right; }

    /* Statuts */
    .statut-row { display:grid; grid-template-columns:110px 1fr 40px 120px;
      gap:.5rem; align-items:center; margin-bottom:.8rem; }
    .statut-badge { border-radius:20px; padding:.2rem .7rem; font-size:.78rem; font-weight:600; }
    .statut-badge.confirmee  { background:#e0f7e9; color:#1a7a3f; }
    .statut-badge.en_attente { background:#fff3e0; color:#e65100; }
    .statut-badge.annulee    { background:#fde8e8; color:#c0392b; }
    .statut-badge.terminee   { background:#f0f0f0; color:#555; }
    .statut-bar-wrap { background:#f7f7f7; border-radius:20px; height:16px; overflow:hidden; }
    .statut-bar { background:#FF385C; height:100%; border-radius:20px; transition:width .5s; }
    .statut-count { font-size:.85rem; font-weight:700; color:#333; text-align:center; }
    .statut-revenu { font-size:.78rem; color:#888; text-align:right; }

    /* Top */
    .top-row { display:grid; grid-template-columns:40px 1fr auto;
      gap:1rem; align-items:center; padding:.7rem 0; border-bottom:1px solid #f0f0f0; }
    .top-row:last-child { border-bottom:none; }
    .top-rank { font-size:1.2rem; font-weight:700; color:#FF385C; }
    .top-info strong { display:block; font-size:.95rem; color:#222; }
    .top-meta { font-size:.8rem; color:#888; text-transform:capitalize; }
    .note-stars { font-size:1rem; font-weight:700; }
    .note-count { font-size:.8rem; color:#888; }
  `]
})
export class StatistiquesComponent implements OnInit {
  chargement = true;
  prixParVille: any[] = [];
  reservationsParStatut: any[] = [];
  topAnnonces: any[] = [];
  revenusMensuels: any[] = [];

  totalReservations = 0;
  revenuTotal = 0;
  maxPrix = 1;
  maxStatut = 1;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.auth.currentUser?.userId !== '665f000000000000000000a1') {
      this.router.navigate(['/']);
      return;
    }
    this.charger();
  }

  charger(): void {
    const base = `${environment.apiUrl}/api/stats`;
    let done = 0;
    const check = () => { if (++done === 3) this.chargement = false; };

    this.http.get<any[]>(`${base}/prix-par-ville`).subscribe({
      next: d => { this.prixParVille = d; this.maxPrix = Math.max(...d.map(v => v.prixMoyen), 1); check(); },
      error: () => check()
    });
    this.http.get<any[]>(`${base}/reservations-par-statut`).subscribe({
      next: d => {
        this.reservationsParStatut = d;
        this.maxStatut = Math.max(...d.map(v => v.total), 1);
        this.totalReservations = d.reduce((s, v) => s + (v.total ?? 0), 0);
        this.revenuTotal = d.filter(v => v.statut === 'confirmee' || v.statut === 'terminee')
                            .reduce((s, v) => s + (v.revenuTotal ?? 0), 0);
        check();
      },
      error: () => check()
    });
    this.http.get<any[]>(`${base}/top-annonces`).subscribe({
      next: d => { this.topAnnonces = d; check(); },
      error: () => check()
    });
  }

  pct(val: number, max: number): number {
    return max > 0 ? Math.round((val / max) * 100) : 0;
  }

  statutFr(s: string): string {
    const m: Record<string,string> = { en_attente:'En attente', confirmee:'Confirmée',
      annulee:'Annulée', terminee:'Terminée' };
    return m[s] ?? s;
  }
}
