import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AnnonceService } from '../../services/annonce.service';
import { ReservationService } from '../../services/reservation.service';
import { AuthService } from '../../services/auth.service';
import { Annonce, Reservation } from '../../models/models';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="reserv-container">
      <a routerLink="/" class="retour">← Retour</a>
      <h1>Finaliser la réservation</h1>

      <div *ngIf="chargement" class="chargement">Chargement...</div>

      <div *ngIf="!chargement && annonce" class="reserv-grid">
        <!-- Formulaire -->
        <div class="reserv-form">
          <h2>Vos informations</h2>

          <div class="form-group">
            <label>Date d'arrivée *</label>
            <input type="date" [(ngModel)]="reservation.dateArrivee" (change)="calculerPrix()" />
          </div>
          <div class="form-group">
            <label>Date de départ *</label>
            <input type="date" [(ngModel)]="reservation.dateDepart" (change)="calculerPrix()" />
          </div>
          <div class="form-group">
            <label>Nombre de voyageurs *</label>
            <input type="number" [(ngModel)]="reservation.nbVoyageurs"
                   [max]="annonce.maxVoyageurs" min="1"
                   (change)="calculerPrix()" />
            <small>Maximum : {{ annonce.maxVoyageurs }} voyageurs</small>
          </div>

          <div class="prix-recap" *ngIf="nbNuits > 0">
            <div class="prix-ligne">
              <span>{{ annonce.prixParNuit | number }} MAD × {{ nbNuits }} nuits</span>
              <span>{{ prixTotal | number }} MAD</span>
            </div>
            <hr />
            <div class="prix-ligne total">
              <strong>Total</strong>
              <strong>{{ prixTotal | number }} MAD</strong>
            </div>
          </div>

          <div class="message-erreur" *ngIf="erreur">{{ erreur }}</div>
          <div class="message-succes" *ngIf="succes">
            ✓ Réservation confirmée ! Vous serez contacté par l'hôte.
          </div>

          <button class="btn-confirmer" (click)="confirmerReservation()"
                  [disabled]="!reservationValide() || enCours">
            {{ enCours ? 'Traitement...' : 'Confirmer la réservation' }}
          </button>

          <p class="securite">🔒 Paiement 100% sécurisé · Annulation gratuite sous 24h</p>
        </div>

        <!-- Résumé annonce -->
        <div class="reserv-resume">
          <div class="resume-card">
            <img [src]="annonce.photos?.[0] || 'assets/placeholder.jpg'"
                 [alt]="annonce.titre" />
            <div class="resume-info">
              <p class="resume-type">{{ annonce.type }} · {{ annonce.localisation.ville }}</p>
              <h3>{{ annonce.titre }}</h3>
              <p class="resume-note" *ngIf="annonce.noteMoyenne">
                ⭐ {{ annonce.noteMoyenne }} ({{ annonce.nbAvis }} avis)
              </p>
              <p class="resume-prix">
                <strong>{{ annonce.prixParNuit | number }} MAD</strong> / nuit
              </p>
            </div>
          </div>

          <div class="politique-recap" *ngIf="annonce.politiqueAnnulation">
            <h4>Politique d'annulation</h4>
            <p>{{ annonce.politiqueAnnulation.type | titlecase }} —
               remboursement intégral si annulé
               {{ annonce.politiqueAnnulation.delaiRemboursement }} jours avant l'arrivée.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reserv-container { max-width: 900px; margin: 0 auto; padding: 2rem; }
    .retour { color: #FF385C; text-decoration: none; font-weight: 500; }
    .retour:hover { text-decoration: underline; }
    h1 { margin: 1rem 0 2rem; font-size: 1.8rem; }
    .chargement { text-align:center; padding:3rem; color:#717171; }

    .reserv-grid { display:grid; grid-template-columns:1fr 380px; gap:3rem; }

    .form-group { margin-bottom:1.2rem; }
    .form-group label { display:block; font-weight:600; margin-bottom:.4rem; color:#333; }
    .form-group input {
      width:100%; padding:.8rem; border:1px solid #ddd; border-radius:8px;
      font-size:.95rem; font-family:inherit;
    }
    .form-group input:focus { outline:none; border-color:#FF385C; }
    .form-group small { color:#717171; font-size:.8rem; }

    .prix-recap {
      background:#f7f7f7; border-radius:10px; padding:1rem; margin:1.5rem 0;
    }
    .prix-ligne { display:flex; justify-content:space-between; padding:.4rem 0; }
    .total { font-size:1.05rem; }

    .message-erreur { background:#ffe0e0; color:#c0392b; border-radius:8px;
      padding:.8rem 1rem; margin:.8rem 0; }
    .message-succes { background:#e0f7e9; color:#1a7a3f; border-radius:8px;
      padding:.8rem 1rem; margin:.8rem 0; }

    .btn-confirmer {
      width:100%; background:#FF385C; color:white; border:none; border-radius:8px;
      padding:1rem; font-size:1rem; font-weight:700; cursor:pointer; transition:background .2s;
    }
    .btn-confirmer:hover:not(:disabled) { background:#e31c5f; }
    .btn-confirmer:disabled { background:#ccc; cursor:not-allowed; }
    .securite { text-align:center; color:#717171; font-size:.8rem; margin-top:.7rem; }

    .resume-card { border:1px solid #eee; border-radius:12px; overflow:hidden; }
    .resume-card img { width:100%; height:180px; object-fit:cover; }
    .resume-info { padding:1rem; }
    .resume-type { color:#717171; font-size:.85rem; text-transform:capitalize; }
    .resume-info h3 { font-size:1rem; margin:.3rem 0; }
    .resume-note { font-size:.85rem; color:#555; }
    .resume-prix { margin-top:.5rem; }
    .resume-prix strong { font-size:1.1rem; }

    .politique-recap { margin-top:1rem; border:1px solid #eee; border-radius:10px;
      padding:1rem; }
    .politique-recap h4 { font-size:.95rem; margin-bottom:.5rem; }
    .politique-recap p  { color:#555; font-size:.9rem; line-height:1.5; }
  `]
})
export class ReservationComponent implements OnInit {
  annonce: Annonce | null = null;
  chargement = true;
  enCours = false;
  succes = false;
  erreur = '';
  nbNuits = 0;
  prixTotal = 0;

  reservation: Reservation = {
    annonceId: '',
    voyageurId: '',
    dateArrivee: '',
    dateDepart: '',
    nbVoyageurs: 1
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private annonceService: AnnonceService,
    private reservationService: ReservationService,
    private auth: AuthService
  ) {
    this.reservation.voyageurId = this.auth.currentUser?.userId ?? '';
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('annonceId')!;
    this.reservation.annonceId = id;
    const qp = this.route.snapshot.queryParams;
    if (qp['dateArrivee']) this.reservation.dateArrivee = qp['dateArrivee'];
    if (qp['dateDepart'])  this.reservation.dateDepart  = qp['dateDepart'];
    if (qp['nbVoyageurs']) this.reservation.nbVoyageurs = +qp['nbVoyageurs'];

    this.annonceService.detail(id).subscribe({
      next: data => { this.annonce = data; this.chargement = false; this.calculerPrix(); },
      error: () => { this.chargement = false; }
    });
  }

  calculerPrix(): void {
    if (!this.reservation.dateArrivee || !this.reservation.dateDepart) return;
    const ms = new Date(this.reservation.dateDepart).getTime()
             - new Date(this.reservation.dateArrivee).getTime();
    this.nbNuits = Math.max(0, Math.floor(ms / 86400000));
    this.prixTotal = this.nbNuits * (this.annonce?.prixParNuit ?? 0);
  }

  reservationValide(): boolean {
    return !!(this.reservation.dateArrivee && this.reservation.dateDepart
              && this.nbNuits > 0 && this.reservation.nbVoyageurs >= 1);
  }

  confirmerReservation(): void {
    this.enCours = true;
    this.erreur = '';
    this.reservationService.creer(this.reservation).subscribe({
      next: () => { this.succes = true; this.enCours = false; },
      error: (err) => {
        this.erreur = err.error?.erreur ?? 'Une erreur est survenue.';
        this.enCours = false;
      }
    });
  }
}
