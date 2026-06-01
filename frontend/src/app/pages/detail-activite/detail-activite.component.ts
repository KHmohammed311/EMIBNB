import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ActiviteService } from '../../services/activite.service';
import { AvisService } from '../../services/avis.service';
import { Activite, Avis, ActiviteReservation } from '../../models/models';

@Component({
  selector: 'app-detail-activite',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="detail-container">
      <a routerLink="/activites" class="retour">← Toutes les activités</a>

      <div *ngIf="chargement" class="chargement">Chargement...</div>

      <div *ngIf="activite && !chargement">
        <div class="detail-header">
          <span class="categorie-tag">{{ activite.categorie }}</span>
          <h1>{{ activite.titre }}</h1>
          <div class="meta">
            <span>📍 {{ activite.ville }}</span>
            <span>⏱ {{ formatDuree(activite.duree) }}</span>
            <span>👥 Max {{ activite.maxParticipants }} participants</span>
            <span *ngIf="activite.noteMoyenne">⭐ {{ activite.noteMoyenne }}</span>
          </div>
        </div>

        <div class="photo-banner">
          <img [src]="activite.photos?.[0] || 'assets/placeholder.jpg'"
               [alt]="activite.titre" />
        </div>

        <div class="detail-body">
          <div class="detail-gauche">
            <section class="avis-section">
              <h2>Avis des participants ({{ avis.length }})</h2>
              <div class="avis-list">
                <div *ngFor="let a of avis" class="avis-card">
                  <div class="avis-header">
                    <strong>{{ a.auteurNom || a.auteurId }}</strong>
                    <span class="note">{{ '⭐'.repeat(a.note) }}</span>
                  </div>
                  <p>{{ a.commentaire }}</p>
                </div>
              </div>
            </section>
          </div>

          <div class="detail-droite">
            <!-- Widget réservation activité -->
            <div class="widget">
              <div class="prix-header">
                <strong>{{ activite.prix | number }} MAD</strong>
                <span> / personne</span>
              </div>
              <div class="form-group">
                <label>Date</label>
                <input type="date" [(ngModel)]="reserv.date" />
              </div>
              <div class="form-group">
                <label>Participants</label>
                <input type="number" [(ngModel)]="reserv.nbParticipants"
                       [max]="activite.maxParticipants" min="1" />
              </div>
              <div class="prix-total" *ngIf="reserv.nbParticipants > 0">
                Total : <strong>{{ activite.prix * reserv.nbParticipants | number }} MAD</strong>
              </div>
              <div class="message-succes" *ngIf="succes">✓ Réservation effectuée !</div>
              <div class="message-erreur" *ngIf="erreur">{{ erreur }}</div>
              <button class="btn-reserver" (click)="reserver()" [disabled]="!reserv.date">
                Réserver l'activité
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .detail-container { max-width:1100px; margin:0 auto; padding:2rem; }
    .retour { color:#FF385C; text-decoration:none; font-weight:500; }
    .retour:hover { text-decoration:underline; }
    .chargement { text-align:center; padding:3rem; color:#717171; }

    .detail-header { margin:1rem 0; }
    .categorie-tag { background:#FF385C; color:white; border-radius:20px;
      padding:.2rem .8rem; font-size:.8rem; }
    .detail-header h1 { font-size:1.8rem; margin:.5rem 0; }
    .meta { display:flex; gap:1.5rem; color:#555; font-size:.9rem; flex-wrap:wrap; }

    .photo-banner { border-radius:16px; overflow:hidden; height:350px; margin:1.5rem 0; }
    .photo-banner img { width:100%; height:100%; object-fit:cover; }

    .detail-body { display:grid; grid-template-columns:1fr 350px; gap:3rem; }
    .avis-section h2 { font-size:1.1rem; margin-bottom:1rem; }
    .avis-list { display:flex; flex-direction:column; gap:1rem; }
    .avis-card { border:1px solid #eee; border-radius:10px; padding:1rem; }
    .avis-header { display:flex; gap:.8rem; margin-bottom:.5rem; }
    .note { color:#FF385C; }

    .widget { border:1px solid #ddd; border-radius:16px; padding:1.5rem;
      position:sticky; top:100px; box-shadow:0 4px 20px rgba(0,0,0,.1); }
    .prix-header { margin-bottom:1rem; font-size:1.2rem; }
    .form-group { margin-bottom:1rem; }
    .form-group label { display:block; font-weight:600; margin-bottom:.4rem; }
    .form-group input { width:100%; padding:.7rem; border:1px solid #ddd;
      border-radius:8px; font-family:inherit; }
    .prix-total { background:#f7f7f7; border-radius:8px; padding:.7rem; margin:.8rem 0; }
    .message-succes { background:#e0f7e9; color:#1a7a3f; border-radius:8px;
      padding:.7rem; margin:.5rem 0; }
    .message-erreur { background:#fde8e8; color:#c0392b; border-radius:8px;
      padding:.7rem; margin:.5rem 0; }
    .btn-reserver { width:100%; background:#FF385C; color:white; border:none;
      border-radius:8px; padding:1rem; font-weight:700; cursor:pointer;
      font-size:1rem; transition:background .2s; }
    .btn-reserver:hover:not(:disabled) { background:#e31c5f; }
    .btn-reserver:disabled { background:#ccc; cursor:not-allowed; }
  `]
})
export class DetailActiviteComponent implements OnInit {
  activite: Activite | null = null;
  avis: Avis[] = [];
  chargement = true;
  succes = false;
  erreur = '';
  reserv: ActiviteReservation = {
    activiteId: '', voyageurId: '665f000000000000000000a3',
    date: '', nbParticipants: 1
  };

  constructor(
    private route: ActivatedRoute,
    private activiteService: ActiviteService,
    private avisService: AvisService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.reserv.activiteId = id;
    this.activiteService.detail(id).subscribe({
      next: a => { this.activite = a; this.chargement = false; },
      error: () => { this.chargement = false; }
    });
    this.avisService.listerParCible('activite', id).subscribe(data => this.avis = data);
  }

  reserver(): void {
    this.activiteService.reserverActivite(this.reserv).subscribe({
      next: () => { this.succes = true; this.erreur = ''; },
      error: err => { this.erreur = err.error?.erreur ?? 'Erreur de réservation.'; }
    });
  }

  formatDuree(minutes: number): string {
    const h = Math.floor(minutes / 60), m = minutes % 60;
    return m ? `${h}h${m}` : `${h}h`;
  }
}
