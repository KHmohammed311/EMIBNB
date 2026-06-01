import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ActiviteService } from '../../services/activite.service';
import { Activite } from '../../models/models';

@Component({
  selector: 'app-activites',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="activites-container">
      <div class="activites-header">
        <h1>Activités & Expériences</h1>
        <p>Découvrez les meilleures expériences au Maroc</p>
      </div>

      <!-- Filtres -->
      <div class="filtres-bar">
        <input [(ngModel)]="filtreVille" placeholder="Filtrer par ville..."
               (input)="charger()" type="text" />
        <select [(ngModel)]="filtreCategorie" (change)="charger()">
          <option value="">Toutes les catégories</option>
          <option value="Culture & Histoire">Culture &amp; Histoire</option>
          <option value="Gastronomie">Gastronomie</option>
          <option value="Aventure & Nature">Aventure &amp; Nature</option>
          <option value="Sport & Bien-être">Sport &amp; Bien-être</option>
        </select>
      </div>

      <!-- Grille -->
      <div *ngIf="chargement" class="chargement">Chargement...</div>

      <div class="activites-grid" *ngIf="!chargement">
        <div *ngFor="let a of activites" class="activite-card"
             [routerLink]="['/activites', a.id]">
          <div class="activite-photo">
            <img [src]="a.photos?.[0] || 'assets/placeholder.jpg'" [alt]="a.titre" />
            <span class="categorie-badge">{{ a.categorie }}</span>
          </div>
          <div class="activite-body">
            <h3>{{ a.titre }}</h3>
            <p class="activite-meta">
              📍 {{ a.ville }} · ⏱ {{ formatDuree(a.duree) }} · 👥 Max {{ a.maxParticipants }}
            </p>
            <div class="activite-footer">
              <span class="note" *ngIf="a.noteMoyenne">⭐ {{ a.noteMoyenne }}</span>
              <span class="prix">{{ a.prix | number }} MAD / pers.</span>
            </div>
          </div>
        </div>
      </div>

      <p *ngIf="!chargement && activites.length === 0" class="vide">
        Aucune activité trouvée.
      </p>
    </div>
  `,
  styles: [`
    .activites-container { padding:2rem; max-width:1200px; margin:0 auto; }
    .activites-header { text-align:center; margin-bottom:2rem; }
    .activites-header h1 { font-size:2rem; margin-bottom:.3rem; }
    .activites-header p  { color:#717171; font-size:1rem; }

    .filtres-bar { display:flex; gap:1rem; margin-bottom:2rem; }
    .filtres-bar input, .filtres-bar select {
      padding:.7rem 1rem; border:1px solid #ddd; border-radius:8px;
      font-size:.9rem; font-family:inherit; flex:1;
    }

    .chargement { text-align:center; padding:3rem; color:#717171; }
    .vide { text-align:center; color:#717171; padding:3rem; }

    .activites-grid {
      display:grid; grid-template-columns:repeat(auto-fill, minmax(300px, 1fr));
      gap:1.5rem;
    }
    .activite-card {
      border-radius:16px; overflow:hidden;
      box-shadow:0 2px 12px rgba(0,0,0,.08);
      cursor:pointer; transition:transform .2s, box-shadow .2s;
    }
    .activite-card:hover {
      transform:translateY(-4px); box-shadow:0 8px 24px rgba(0,0,0,.15);
    }
    .activite-photo { position:relative; height:200px; overflow:hidden; }
    .activite-photo img { width:100%; height:100%; object-fit:cover; }
    .categorie-badge {
      position:absolute; top:.7rem; left:.7rem;
      background:rgba(255,255,255,.9); border-radius:20px;
      padding:.2rem .7rem; font-size:.75rem; font-weight:600;
    }
    .activite-body { padding:1rem; background:white; }
    .activite-body h3 { font-size:1rem; font-weight:600; margin-bottom:.5rem; }
    .activite-meta { font-size:.85rem; color:#717171; margin-bottom:.8rem; }
    .activite-footer { display:flex; justify-content:space-between; align-items:center; }
    .note { color:#555; font-size:.9rem; }
    .prix { font-weight:700; color:#FF385C; font-size:1rem; }
  `]
})
export class ActivitesComponent implements OnInit {
  activites: Activite[] = [];
  chargement = true;
  filtreVille = '';
  filtreCategorie = '';

  constructor(private activiteService: ActiviteService) {}

  ngOnInit(): void { this.charger(); }

  charger(): void {
    this.chargement = true;
    this.activiteService.lister(
      this.filtreVille || undefined,
      this.filtreCategorie || undefined
    ).subscribe({
      next: data => { this.activites = data; this.chargement = false; },
      error: () => { this.chargement = false; }
    });
  }

  formatDuree(minutes: number): string {
    if (minutes < 60) return `${minutes} min`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m ? `${h}h${m}` : `${h}h`;
  }
}
