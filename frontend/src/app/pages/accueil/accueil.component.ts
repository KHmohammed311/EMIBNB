import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AnnonceService } from '../../services/annonce.service';
import { Annonce, FiltresRecherche } from '../../models/models';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <!-- Bannière de recherche -->
    <section class="hero">
      <h1>Trouvez votre hébergement idéal au Maroc</h1>
      <p>Appartements, riads, villas... découvrez les plus belles adresses</p>

      <div class="search-bar">
        <div class="search-field">
          <label>Destination</label>
          <input [(ngModel)]="filtres.ville" placeholder="Casablanca, Marrakech..."
                 type="text" (keyup.enter)="rechercher()" />
        </div>
        <div class="search-field">
          <label>Arrivée</label>
          <input [(ngModel)]="filtres.dateArrivee" type="date" />
        </div>
        <div class="search-field">
          <label>Départ</label>
          <input [(ngModel)]="filtres.dateDepart" type="date" />
        </div>
        <div class="search-field">
          <label>Voyageurs</label>
          <input [(ngModel)]="filtres.nbVoyageurs" type="number" min="1" placeholder="2" />
        </div>
        <button class="btn-rechercher" (click)="rechercher()">Rechercher</button>
      </div>
    </section>

    <!-- Filtres rapides -->
    <section class="filtres-rapides">
      <button [class.actif]="typeActif === ''" (click)="filtrerParType('')">Tous</button>
      <button [class.actif]="typeActif === 'appartement'" (click)="filtrerParType('appartement')">
        🏢 Appartements
      </button>
      <button [class.actif]="typeActif === 'maison'" (click)="filtrerParType('maison')">
        🏡 Maisons
      </button>
      <button [class.actif]="typeActif === 'villa'" (click)="filtrerParType('villa')">
        🏰 Villas
      </button>
      <button [class.actif]="typeActif === 'chambre'" (click)="filtrerParType('chambre')">
        🛏️ Chambres
      </button>
    </section>

    <!-- Résultats -->
    <section class="annonces-section">
      <div *ngIf="chargement" class="chargement">Chargement des annonces...</div>

      <div *ngIf="!chargement" class="annonces-grid">
        <div *ngFor="let annonce of annonces" class="annonce-card"
             [routerLink]="['/annonces', annonce.id]">
          <div class="card-photo">
            <img [src]="annonce.photos?.[0] || 'assets/placeholder.jpg'"
                 [alt]="annonce.titre" />
            <div class="card-type">{{ annonce.type }}</div>
          </div>
          <div class="card-body">
            <div class="card-header">
              <h3>{{ annonce.titre }}</h3>
              <div class="card-note" *ngIf="annonce.noteMoyenne">
                ⭐ {{ annonce.noteMoyenne }} ({{ annonce.nbAvis }})
              </div>
            </div>
            <p class="card-ville">📍 {{ annonce.localisation.ville }}, {{ annonce.localisation.pays }}</p>
            <p class="card-capacite">👥 Jusqu'à {{ annonce.maxVoyageurs }} voyageurs</p>
            <div class="card-equipements">
              <span *ngIf="annonce.caracteristiques?.wifi">📶</span>
              <span *ngIf="annonce.caracteristiques?.piscine">🏊</span>
              <span *ngIf="annonce.caracteristiques?.parking">🅿️</span>
              <span *ngIf="annonce.caracteristiques?.climatisation">❄️</span>
            </div>
            <div class="card-prix">
              <strong>{{ annonce.prixParNuit | number }} MAD</strong>
              <span class="par-nuit">/ nuit</span>
            </div>
          </div>
        </div>
      </div>

      <p *ngIf="!chargement && annonces.length === 0" class="aucun-resultat">
        Aucune annonce trouvée pour ces critères.
      </p>
    </section>
  `,
  styles: [`
    .hero {
      background: linear-gradient(135deg, #FF385C 0%, #bd1e59 100%);
      color: white; text-align: center; padding: 4rem 2rem 3rem;
    }
    .hero h1 { font-size: 2.2rem; margin-bottom: .5rem; }
    .hero p  { font-size: 1.1rem; opacity: .9; margin-bottom: 2rem; }

    .search-bar {
      display: flex; gap: 0; background: white; border-radius: 50px;
      padding: .5rem; max-width: 900px; margin: 0 auto;
      box-shadow: 0 4px 20px rgba(0,0,0,.2);
    }
    .search-field {
      display: flex; flex-direction: column; padding: .5rem 1rem;
      flex: 1; border-right: 1px solid #eee;
    }
    .search-field:last-of-type { border-right: none; }
    .search-field label { font-size: .7rem; font-weight: 700; color: #333; }
    .search-field input {
      border: none; outline: none; font-size: .9rem; color: #333;
      padding: .2rem 0; background: transparent;
    }
    .btn-rechercher {
      background: #FF385C; color: white; border: none; border-radius: 50px;
      padding: .8rem 1.5rem; cursor: pointer; font-weight: 700;
      white-space: nowrap; transition: background .2s;
    }
    .btn-rechercher:hover { background: #e31c5f; }

    .filtres-rapides {
      display: flex; gap: 1rem; padding: 1.5rem 2rem;
      overflow-x: auto; border-bottom: 1px solid #e0e0e0;
    }
    .filtres-rapides button {
      background: none; border: 1px solid #ddd; border-radius: 50px;
      padding: .5rem 1.2rem; cursor: pointer; white-space: nowrap;
      font-size: .9rem; transition: all .2s;
    }
    .filtres-rapides button.actif,
    .filtres-rapides button:hover {
      background: #FF385C; color: white; border-color: #FF385C;
    }

    .annonces-section { padding: 2rem; }
    .annonces-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }
    .annonce-card {
      border-radius: 16px; overflow: hidden;
      box-shadow: 0 2px 12px rgba(0,0,0,.08);
      cursor: pointer; transition: transform .2s, box-shadow .2s;
      background: white;
    }
    .annonce-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,.15);
    }
    .card-photo { position: relative; height: 200px; overflow: hidden; }
    .card-photo img {
      width: 100%; height: 100%; object-fit: cover;
      transition: transform .3s;
    }
    .annonce-card:hover .card-photo img { transform: scale(1.05); }
    .card-type {
      position: absolute; top: .7rem; left: .7rem;
      background: rgba(255,255,255,.9); border-radius: 20px;
      padding: .2rem .7rem; font-size: .75rem; font-weight: 600;
      text-transform: capitalize;
    }
    .card-body { padding: 1rem; }
    .card-header { display: flex; justify-content: space-between; align-items: flex-start; gap: .5rem; }
    .card-header h3 { font-size: 1rem; font-weight: 600; color: #222; margin: 0; }
    .card-note { font-size: .85rem; color: #555; white-space: nowrap; }
    .card-ville { font-size: .85rem; color: #717171; margin: .3rem 0; }
    .card-capacite { font-size: .85rem; color: #717171; margin: .2rem 0; }
    .card-equipements { display: flex; gap: .3rem; margin: .5rem 0; font-size: 1rem; }
    .card-prix { margin-top: .7rem; }
    .card-prix strong { font-size: 1.05rem; color: #222; }
    .par-nuit { color: #717171; font-size: .85rem; }
    .chargement { text-align: center; padding: 3rem; color: #717171; font-size: 1.1rem; }
    .aucun-resultat { text-align: center; color: #717171; padding: 3rem; font-size: 1.1rem; }
  `]
})
export class AccueilComponent implements OnInit {
  annonces: Annonce[] = [];
  chargement = true;
  filtres: FiltresRecherche = {};
  typeActif = '';

  constructor(private annonceService: AnnonceService) {}

  ngOnInit(): void {
    this.chargerAnnonces();
  }

  chargerAnnonces(): void {
    this.chargement = true;
    this.annonceService.lister(this.filtres).subscribe({
      next: data => { this.annonces = data; this.chargement = false; },
      error: () => { this.annonces = []; this.chargement = false; }
    });
  }

  rechercher(): void {
    this.chargerAnnonces();
  }

  filtrerParType(type: string): void {
    this.typeActif = type;
    this.filtres.type = type || undefined;
    this.chargerAnnonces();
  }
}
