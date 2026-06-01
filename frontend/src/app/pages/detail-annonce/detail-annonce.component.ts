import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AnnonceService } from '../../services/annonce.service';
import { AvisService } from '../../services/avis.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Annonce, Avis, User } from '../../models/models';

@Component({
  selector: 'app-detail-annonce',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div *ngIf="chargement" class="chargement">Chargement...</div>

    <div *ngIf="annonce && !chargement" class="detail-container">

      <!-- En-tête -->
      <div class="detail-header">
        <h1>{{ annonce.titre }}</h1>
        <div class="header-meta">
          <span *ngIf="annonce.noteMoyenne">⭐ {{ annonce.noteMoyenne }} · {{ annonce.nbAvis }} avis</span>
          <span class="separator">·</span>
          <span>📍 {{ annonce.localisation.ville }}, {{ annonce.localisation.pays }}</span>
        </div>
      </div>

      <!-- Galerie photos -->
      <div class="galerie">
        <div class="photo-principale">
          <img [src]="annonce.photos?.[0] || 'assets/placeholder.jpg'" [alt]="annonce.titre" />
        </div>
        <div class="photos-secondaires" *ngIf="(annonce.photos?.length ?? 0) > 1">
          <img *ngFor="let p of annonce.photos?.slice(1, 5)"
               [src]="p" [alt]="annonce.titre" />
        </div>
      </div>

      <div class="detail-body">
        <!-- Colonne gauche -->
        <div class="detail-gauche">

          <div class="detail-info">
            <h2>{{ typePretty(annonce.type) }} · Jusqu'à {{ annonce.maxVoyageurs }} voyageurs</h2>
            <div class="hote-ligne" *ngIf="hote">
              <img [src]="hote.avatar || 'https://ui-avatars.com/api/?name=' + hote.name + '&background=FF385C&color=fff&size=48'"
                   class="hote-avatar" [alt]="hote.name" />
              <div>
                <span class="hote-label">Proposé par</span>
                <strong class="hote-nom">{{ hote.name }}</strong>
                <span class="hote-rating" *ngIf="hote.avgRating">⭐ {{ hote.avgRating }}</span>
              </div>
            </div>
            <hr />
            <p class="description">{{ annonce.description }}</p>
          </div>

          <!-- Équipements -->
          <div class="section" *ngIf="annonce.equipements?.length">
            <h3>Ce que propose ce logement</h3>
            <div class="equipements-grid">
              <div class="equipement" *ngFor="let eq of annonce.equipements">
                <span>✓</span> {{ eq }}
              </div>
            </div>
          </div>

          <!-- Caractéristiques -->
          <div class="section" *ngIf="annonce.caracteristiques">
            <h3>Caractéristiques</h3>
            <div class="carac-grid">
              <div *ngIf="annonce.caracteristiques.piscine"  class="carac">🏊 Piscine</div>
              <div *ngIf="annonce.caracteristiques.parking"  class="carac">🅿️ Parking</div>
              <div *ngIf="annonce.caracteristiques.wifi"     class="carac">📶 WiFi</div>
              <div *ngIf="annonce.caracteristiques.climatisation" class="carac">❄️ Climatisation</div>
              <div *ngIf="annonce.caracteristiques.cuisine"  class="carac">🍳 Cuisine</div>
              <div *ngIf="annonce.caracteristiques.animaux"  class="carac">🐾 Animaux acceptés</div>
              <div *ngIf="annonce.caracteristiques.jacuzzi"  class="carac">🛁 Jacuzzi</div>
            </div>
          </div>

          <!-- Politique d'annulation -->
          <div class="section" *ngIf="annonce.politiqueAnnulation">
            <h3>Politique d'annulation</h3>
            <p class="politique">
              <strong>{{ annulation(annonce.politiqueAnnulation.type) }}</strong> —
              Remboursement intégral si annulé
              {{ annonce.politiqueAnnulation.delaiRemboursement }} jours avant l'arrivée.
            </p>
          </div>

          <!-- Avis -->
          <div class="section">
            <h3>⭐ {{ annonce.noteMoyenne }} · {{ avis.length }} avis</h3>
            <div class="avis-list">
              <div class="avis-card" *ngFor="let a of avis">
                <div class="avis-header">
                  <strong>{{ a.auteurNom || a.auteurId }}</strong>
                  <span class="avis-note">{{ '⭐'.repeat(a.note) }}</span>
                  <span class="avis-date">{{ a.createdAt | date:'MMMM yyyy':'':'fr' }}</span>
                </div>
                <p>{{ a.commentaire }}</p>
              </div>
            </div>

            <!-- Formulaire avis -->
            <div class="avis-form" *ngIf="afficherFormulaireAvis">
              <h4>Laisser un avis</h4>
              <div class="note-selector">
                <button *ngFor="let n of [1,2,3,4,5]"
                        [class.selected]="nouvelAvis.note === n"
                        (click)="nouvelAvis.note = n">{{ '⭐'.repeat(n) }}</button>
              </div>
              <textarea [(ngModel)]="nouvelAvis.commentaire"
                        placeholder="Votre commentaire..." rows="4"></textarea>
              <button class="btn-avis" (click)="soumettreAvis()">Publier l'avis</button>
            </div>
          </div>
        </div>

        <!-- Colonne droite — Widget réservation -->
        <div class="detail-droite">
          <div class="widget-reservation">
            <div class="widget-prix">
              <strong>{{ annonce.prixParNuit | number }} MAD</strong>
              <span> / nuit</span>
            </div>
            <div class="note-badge" *ngIf="annonce.noteMoyenne">
              ⭐ {{ annonce.noteMoyenne }} · {{ annonce.nbAvis }} avis
            </div>
            <div class="widget-form">
              <div class="dates-row">
                <div class="date-field">
                  <label>ARRIVÉE</label>
                  <input type="date" [(ngModel)]="dateArrivee" />
                </div>
                <div class="date-field">
                  <label>DÉPART</label>
                  <input type="date" [(ngModel)]="dateDepart" />
                </div>
              </div>
              <div class="voyageurs-field">
                <label>VOYAGEURS</label>
                <input type="number" [(ngModel)]="nbVoyageurs"
                       [max]="annonce.maxVoyageurs" min="1" />
              </div>
              <a class="btn-reserver" [routerLink]="['/reserver', annonce.id]"
                 [queryParams]="{ dateArrivee, dateDepart, nbVoyageurs }">
                Réserver
              </a>
              <p class="widget-note">Aucun frais ne sera débité pour l'instant</p>
            </div>

            <div class="widget-total" *ngIf="dateArrivee && dateDepart">
              <div class="prix-ligne">
                <span>{{ annonce.prixParNuit }} × {{ nbNuits() }} nuits</span>
                <span>{{ annonce.prixParNuit * nbNuits() | number }} MAD</span>
              </div>
              <hr />
              <div class="prix-ligne total">
                <strong>Total</strong>
                <strong>{{ annonce.prixParNuit * nbNuits() | number }} MAD</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chargement { text-align:center; padding:3rem; color:#717171; }
    .detail-container { max-width: 1100px; margin: 0 auto; padding: 1.5rem 2rem; }
    .detail-header { margin-bottom: 1.2rem; }
    .detail-header h1 { font-size: 1.8rem; margin-bottom: .3rem; }
    .header-meta { color: #555; font-size: .95rem; }
    .separator { margin: 0 .5rem; }

    .galerie { display: grid; grid-template-columns: 1fr 1fr; gap: .5rem;
               border-radius: 12px; overflow: hidden; margin-bottom: 2rem; }
    .photo-principale img,
    .photos-secondaires img {
      width:100%; height:250px; object-fit:cover;
    }
    .photos-secondaires { display:grid; grid-template-columns:1fr 1fr; gap:.5rem; }

    .detail-body { display: grid; grid-template-columns: 1fr 380px; gap: 3rem; }
    .detail-info h2 { font-size:1.2rem; margin-bottom:.8rem; }
    .hote-ligne { display:flex; align-items:center; gap:.9rem; margin:.8rem 0 1rem;
      padding:.8rem; background:#fff8f8; border-radius:12px; }
    .hote-avatar { width:48px; height:48px; border-radius:50%; object-fit:cover; }
    .hote-label { display:block; font-size:.75rem; color:#999; }
    .hote-nom { display:block; font-size:1rem; color:#222; }
    .hote-rating { margin-left:.5rem; font-size:.85rem; color:#FF385C; }
    .description { color:#444; line-height:1.7; }
    .section { margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #e0e0e0; }
    .section h3 { font-size:1.1rem; margin-bottom:1rem; }

    .equipements-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:.6rem; }
    .equipement { display:flex; gap:.5rem; color:#333; font-size:.9rem; }
    .carac-grid { display:flex; flex-wrap:wrap; gap:.7rem; }
    .carac { background:#f7f7f7; border-radius:8px; padding:.5rem 1rem; font-size:.9rem; }
    .politique { color:#444; line-height:1.6; }

    .avis-list { display:flex; flex-direction:column; gap:1rem; }
    .avis-card { border:1px solid #eee; border-radius:10px; padding:1rem; }
    .avis-header { display:flex; gap:.8rem; align-items:center; margin-bottom:.5rem;
                   flex-wrap:wrap; }
    .avis-note { color:#FF385C; }
    .avis-date { color:#717171; font-size:.85rem; margin-left:auto; }

    .avis-form { margin-top:1.5rem; }
    .avis-form h4 { margin-bottom:.8rem; }
    .note-selector { display:flex; gap:.5rem; margin-bottom:.8rem; }
    .note-selector button { background:none; border:1px solid #ddd; border-radius:8px;
      padding:.4rem .7rem; cursor:pointer; transition:all .2s; }
    .note-selector button.selected { background:#FF385C; color:white; border-color:#FF385C; }
    .avis-form textarea { width:100%; border:1px solid #ddd; border-radius:8px;
      padding:.8rem; font-family:inherit; resize:vertical; }
    .btn-avis { margin-top:.7rem; background:#FF385C; color:white; border:none;
      border-radius:8px; padding:.7rem 1.5rem; cursor:pointer; font-weight:600; }

    .widget-reservation {
      border: 1px solid #ddd; border-radius:16px; padding:1.5rem;
      position:sticky; top:100px; box-shadow:0 4px 20px rgba(0,0,0,.1);
    }
    .widget-prix strong { font-size:1.4rem; }
    .widget-prix span   { color:#717171; }
    .note-badge { font-size:.85rem; color:#555; margin:.3rem 0; }
    .widget-form { margin-top:1rem; }
    .dates-row { display:grid; grid-template-columns:1fr 1fr; border:1px solid #333;
      border-radius:8px; overflow:hidden; margin-bottom:.5rem; }
    .date-field { padding:.7rem; border-right:1px solid #333; }
    .date-field:last-child { border-right:none; }
    .date-field label { display:block; font-size:.65rem; font-weight:700; letter-spacing:.05em; }
    .date-field input,
    .voyageurs-field input {
      border:none; outline:none; width:100%; font-size:.9rem; background:transparent;
    }
    .voyageurs-field { border:1px solid #333; border-radius:8px; padding:.7rem; margin-bottom:1rem; }
    .voyageurs-field label { display:block; font-size:.65rem; font-weight:700; }
    .btn-reserver {
      display:block; text-align:center; background:#FF385C; color:white !important;
      text-decoration:none; border-radius:8px; padding:1rem; font-weight:700;
      font-size:1rem; transition:background .2s;
    }
    .btn-reserver:hover { background:#e31c5f; }
    .widget-note { text-align:center; color:#717171; font-size:.8rem; margin-top:.5rem; }
    .widget-total { margin-top:1rem; }
    .prix-ligne { display:flex; justify-content:space-between; padding:.4rem 0;
      font-size:.95rem; }
    .total { font-size:1rem; }
  `]
})
export class DetailAnnonceComponent implements OnInit {
  annonce: Annonce | null = null;
  hote: User | null = null;
  avis: Avis[] = [];
  nomsAuteurs: Record<string, string> = {};
  chargement = true;
  dateArrivee = '';
  dateDepart = '';
  nbVoyageurs = 1;
  afficherFormulaireAvis = true;
  nouvelAvis = { note: 5, commentaire: '' };

  constructor(
    private route: ActivatedRoute,
    private annonceService: AnnonceService,
    private avisService: AvisService,
    private userService: UserService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.annonceService.detail(id).subscribe({
      next: data => {
        this.annonce = data;
        this.chargement = false;
        this.chargerAvis(id);
        if (data.hoteId) {
          this.userService.profil(data.hoteId).subscribe({
            next: u => this.hote = u,
            error: () => {}
          });
        }
      },
      error: () => { this.chargement = false; }
    });
    // Pré-remplir voyageurId depuis l'utilisateur connecté
    this.nouvelAvis = { note: 5, commentaire: '' };
  }

  chargerAvis(id: string): void {
    this.avisService.listerParCible('annonce', id).subscribe({
      next: data => this.avis = data
    });
  }

  soumettreAvis(): void {
    if (!this.annonce?.id) return;
    const avis: Avis = {
      cibleId: this.annonce.id,
      cibleType: 'annonce',
      auteurId: '665f000000000000000000a3',
      reservationId: '665f000000000000000000c1',
      note: this.nouvelAvis.note,
      commentaire: this.nouvelAvis.commentaire
    };
    this.avisService.creer(avis).subscribe({
      next: () => {
        this.chargerAvis(this.annonce!.id!);
        this.nouvelAvis = { note: 5, commentaire: '' };
      }
    });
  }

  nbNuits(): number {
    if (!this.dateArrivee || !this.dateDepart) return 0;
    const ms = new Date(this.dateDepart).getTime() - new Date(this.dateArrivee).getTime();
    return Math.max(0, Math.floor(ms / 86400000));
  }

  typePretty(type: string): string {
    const map: Record<string, string> = {
      appartement: 'Appartement', maison: 'Maison',
      chambre: 'Chambre', villa: 'Villa'
    };
    return map[type] ?? type;
  }

  annulation(type: string): string {
    const map: Record<string, string> = {
      flexible: 'Flexible', moderee: 'Modérée', stricte: 'Stricte'
    };
    return map[type] ?? type;
  }
}
