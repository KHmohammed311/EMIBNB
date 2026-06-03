import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AnnonceService } from '../../services/annonce.service';
import { ReservationService } from '../../services/reservation.service';
import { AuthService } from '../../services/auth.service';
import { Annonce, Reservation } from '../../models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Dashboard Hôte</h1>
        <button class="btn-add" (click)="afficherFormulaire = !afficherFormulaire">
          {{ afficherFormulaire ? '✕ Annuler' : '+ Nouvelle annonce' }}
        </button>
      </div>

      <!-- Statistiques -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-nombre">{{ annonces.length }}</div>
          <div class="stat-label">Annonces actives</div>
        </div>
        <div class="stat-card">
          <div class="stat-nombre">{{ reservationsConfirmees }}</div>
          <div class="stat-label">Réservations confirmées</div>
        </div>
        <div class="stat-card">
          <div class="stat-nombre">{{ revenuTotal | number }} MAD</div>
          <div class="stat-label">Revenu total</div>
        </div>
        <div class="stat-card">
          <div class="stat-nombre">{{ noteMoyenne }}</div>
          <div class="stat-label">⭐ Note moyenne</div>
        </div>
      </div>

      <!-- Formulaire nouvelle annonce -->
      <div *ngIf="afficherFormulaire" class="form-card">
        <h2>Créer une nouvelle annonce</h2>
        <div class="form-grid">
          <div class="form-group">
            <label>Titre * <small>(min. 3 caractères)</small></label>
            <input [(ngModel)]="nouvelleAnnonce.titre" placeholder="Titre de l'annonce" />
          </div>
          <div class="form-group">
            <label>Type *</label>
            <select [(ngModel)]="nouvelleAnnonce.type">
              <option value="appartement">Appartement</option>
              <option value="maison">Maison</option>
              <option value="chambre">Chambre</option>
              <option value="villa">Villa</option>
            </select>
          </div>
          <div class="form-group">
            <label>Prix par nuit (MAD) *</label>
            <input type="number" [(ngModel)]="nouvelleAnnonce.prixParNuit" />
          </div>
          <div class="form-group">
            <label>Max voyageurs *</label>
            <input type="number" [(ngModel)]="nouvelleAnnonce.maxVoyageurs" />
          </div>
          <div class="form-group full">
            <label>Description * <small>(min. 10 caractères — {{ nouvelleAnnonce.description?.length ?? 0 }}/10)</small></label>
            <textarea [(ngModel)]="nouvelleAnnonce.description" rows="3"
                      placeholder="Décrivez votre logement en quelques mots..."></textarea>
          </div>
          <div class="form-group">
            <label>Ville *</label>
            <input [(ngModel)]="$any(nouvelleAnnonce.localisation).ville" placeholder="Marrakech" />
          </div>
          <div class="form-group">
            <label>Pays</label>
            <input [(ngModel)]="$any(nouvelleAnnonce.localisation).pays" placeholder="Maroc" />
          </div>
          <div class="form-group full">
            <label>URL de la photo principale</label>
            <input [(ngModel)]="photoUrl" placeholder="https://images.unsplash.com/..." />
            <small style="color:#888;font-size:.8rem">Laisser vide pour une photo par défaut</small>
          </div>
          <!-- Politique d'annulation -->
          <div class="form-group">
            <label>Politique d'annulation *</label>
            <select [(ngModel)]="$any(nouvelleAnnonce).politiqueAnnulation.type">
              <option value="flexible">Flexible — remboursement jusqu'à 1j avant</option>
              <option value="moderee">Modérée — remboursement jusqu'à 5j avant</option>
              <option value="stricte">Stricte — remboursement jusqu'à 14j avant</option>
            </select>
          </div>
          <!-- Caractéristiques -->
          <div class="form-group full">
            <label>Équipements & Caractéristiques</label>
            <div class="checkboxes-grid">
              <label class="checkbox-item"><input type="checkbox" [(ngModel)]="$any(nouvelleAnnonce.caracteristiques).wifi"> 📶 WiFi</label>
              <label class="checkbox-item"><input type="checkbox" [(ngModel)]="$any(nouvelleAnnonce.caracteristiques).climatisation"> ❄️ Climatisation</label>
              <label class="checkbox-item"><input type="checkbox" [(ngModel)]="$any(nouvelleAnnonce.caracteristiques).cuisine"> 🍳 Cuisine équipée</label>
              <label class="checkbox-item"><input type="checkbox" [(ngModel)]="$any(nouvelleAnnonce.caracteristiques).parking"> 🅿️ Parking</label>
              <label class="checkbox-item"><input type="checkbox" [(ngModel)]="$any(nouvelleAnnonce.caracteristiques).piscine"> 🏊 Piscine</label>
              <label class="checkbox-item"><input type="checkbox" [(ngModel)]="$any(nouvelleAnnonce.caracteristiques).jacuzzi"> 🛁 Jacuzzi</label>
              <label class="checkbox-item"><input type="checkbox" [(ngModel)]="$any(nouvelleAnnonce.caracteristiques).animaux"> 🐾 Animaux acceptés</label>
            </div>
          </div>
        </div>
        <div class="form-actions">
          <button class="btn-publier" (click)="publierAnnonce()" [disabled]="!formulaireValide()">
            Publier l'annonce
          </button>
        </div>
        <div class="message-succes" *ngIf="annonceCreee">✓ Annonce publiée avec succès !</div>
        <div class="message-erreur" *ngIf="erreurCreation">{{ erreurCreation }}</div>
      </div>

      <!-- Mes annonces -->
      <div class="section">
        <h2>Mes annonces ({{ annonces.length }})</h2>
        <div class="annonces-table">
          <table>
            <thead>
              <tr>
                <th>Titre</th>
                <th>Ville</th>
                <th>Type</th>
                <th>Prix/nuit</th>
                <th>Note</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let a of annonces">
                <td>{{ a.titre }}</td>
                <td>{{ a.localisation.ville }}</td>
                <td class="type-cell">{{ a.type }}</td>
                <td>{{ a.prixParNuit | number }} MAD</td>
                <td>{{ a.noteMoyenne ? (a.noteMoyenne + ' ⭐') : '—' }}</td>
                <td>
                  <a [routerLink]="['/annonces', a.id]" class="btn-action voir">Voir</a>
                  <button class="btn-action supprimer"
                          (click)="supprimerAnnonce(a.id!)">Supprimer</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Réservations reçues -->
      <div class="section">
        <h2>Réservations reçues ({{ reservations.length }})</h2>
        <div class="reserv-table">
          <table>
            <thead>
              <tr>
                <th>Annonce</th>
                <th>Arrivée</th>
                <th>Départ</th>
                <th>Voyageurs</th>
                <th>Total</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let r of reservations">
                <td>{{ titreAnnonce(r.annonceId) }}</td>
                <td>{{ r.dateArrivee | date:'dd/MM/yyyy' }}</td>
                <td>{{ r.dateDepart | date:'dd/MM/yyyy' }}</td>
                <td>{{ r.nbVoyageurs }}</td>
                <td>{{ r.prixTotal | number }} MAD</td>
                <td><span class="statut-badge" [class]="r.statut">{{ statutFr(r.statut) }}</span></td>
                <td>
                  <button *ngIf="r.statut === 'en_attente'"
                          class="btn-action confirmer"
                          (click)="changerStatut(r.id!, 'confirmee')">Confirmer</button>
                  <button *ngIf="r.statut !== 'annulee' && r.statut !== 'terminee'"
                          class="btn-action annuler"
                          (click)="changerStatut(r.id!, 'annulee')">Annuler</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container { padding:2rem; max-width:1200px; margin:0 auto; }
    .dashboard-header { display:flex; justify-content:space-between; align-items:center;
      margin-bottom:2rem; }
    .dashboard-header h1 { font-size:1.8rem; }
    .btn-add { background:#FF385C; color:white; border:none; border-radius:8px;
      padding:.7rem 1.5rem; cursor:pointer; font-weight:600; font-size:.95rem; }

    .stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1rem; margin-bottom:2rem; }
    .stat-card { background:white; border:1px solid #eee; border-radius:12px;
      padding:1.5rem; text-align:center; box-shadow:0 2px 8px rgba(0,0,0,.06); }
    .stat-nombre { font-size:1.8rem; font-weight:700; color:#FF385C; }
    .stat-label  { color:#717171; font-size:.9rem; margin-top:.3rem; }

    .form-card { background:white; border:1px solid #eee; border-radius:16px;
      padding:2rem; margin-bottom:2rem; box-shadow:0 2px 12px rgba(0,0,0,.08); }
    .form-card h2 { margin-bottom:1.5rem; }
    .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
    .form-group.full { grid-column:span 2; }
    .form-group label { display:block; font-weight:600; margin-bottom:.4rem; font-size:.9rem; }
    .form-group input, .form-group select, .form-group textarea {
      width:100%; padding:.7rem; border:1px solid #ddd; border-radius:8px;
      font-family:inherit; font-size:.9rem;
    }
    .form-group textarea { resize:vertical; }
    .form-actions { margin-top:1rem; }
    .btn-publier { background:#FF385C; color:white; border:none; border-radius:8px;
      padding:.8rem 2rem; cursor:pointer; font-weight:600; font-size:.95rem; }
    .btn-publier:disabled { background:#ccc; cursor:not-allowed; }
    .message-succes { margin-top:.8rem; background:#e0f7e9; color:#1a7a3f;
      border-radius:8px; padding:.7rem 1rem; }
    .message-erreur { margin-top:.8rem; background:#fde8e8; color:#c0392b;
      border-radius:8px; padding:.7rem 1rem; }

    .checkboxes-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:.5rem; }
    .checkbox-item { display:flex; align-items:center; gap:.4rem; font-size:.9rem;
      cursor:pointer; padding:.4rem; border-radius:6px; }
    .checkbox-item:hover { background:#fff5f7; }
    .checkbox-item input { width:16px; height:16px; accent-color:#FF385C; }

    .section { margin-bottom:2.5rem; }
    .section h2 { font-size:1.2rem; margin-bottom:1rem; }
    table { width:100%; border-collapse:collapse; }
    th, td { padding:.8rem 1rem; text-align:left; border-bottom:1px solid #eee; }
    th { background:#f7f7f7; font-size:.85rem; font-weight:700; color:#555; }
    .type-cell { text-transform:capitalize; }

    .btn-action { border:none; border-radius:6px; padding:.3rem .8rem;
      cursor:pointer; font-size:.8rem; font-weight:600; margin-right:.3rem; text-decoration:none; }
    .btn-action.voir      { background:#e8f4fd; color:#1a6db5; }
    .btn-action.supprimer { background:#fde8e8; color:#c0392b; }
    .btn-action.confirmer { background:#e0f7e9; color:#1a7a3f; }
    .btn-action.annuler   { background:#fff3e0; color:#e65100; }

    .statut-badge { border-radius:20px; padding:.2rem .8rem; font-size:.8rem; }
    .statut-badge.confirmee  { background:#e0f7e9; color:#1a7a3f; }
    .statut-badge.en_attente { background:#fff3e0; color:#e65100; }
    .statut-badge.annulee    { background:#fde8e8; color:#c0392b; }
    .statut-badge.terminee   { background:#f0f0f0; color:#555; }
  `]
})
export class DashboardComponent implements OnInit {
  annonces: Annonce[] = [];
  reservations: Reservation[] = [];
  afficherFormulaire = false;
  annonceCreee = false;
  erreurCreation = '';
  reservationsConfirmees = 0;
  revenuTotal = 0;
  noteMoyenne: string = '—';
  photoUrl = '';

  private readonly PHOTOS_DEFAUT = [
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
  ];

  nouvelleAnnonce: Partial<Annonce> = {
    titre: '', description: '', type: 'appartement',
    prixParNuit: 0, maxVoyageurs: 1,
    hoteId: '',
    localisation: { ville: '', pays: 'Maroc', coordonnees: undefined },
    photos: [], equipements: [],
    caracteristiques: { wifi: false, climatisation: false, cuisine: false, parking: false, piscine: false, jacuzzi: false, animaux: false },
    politiqueAnnulation: { type: 'flexible', delaiRemboursement: 1 }
  };

  constructor(
    private annonceService: AnnonceService,
    private reservationService: ReservationService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    const userId = this.auth.currentUser?.userId ?? '';
    this.nouvelleAnnonce.hoteId = userId;
    this.annonceService.lister().subscribe(data => {
      this.annonces = data.filter(a => a.hoteId === userId);
      const notees = this.annonces.filter(a => (a.noteMoyenne ?? 0) > 0);
      if (notees.length) {
        const moy = notees.reduce((s, a) => s + (a.noteMoyenne ?? 0), 0) / notees.length;
        this.noteMoyenne = moy.toFixed(1);
      }
    });
    this.reservationService.lister().subscribe(data => {
      this.reservations = data;
      this.reservationsConfirmees = data.filter(r => r.statut === 'confirmee').length;
      this.revenuTotal = data
        .filter(r => r.statut === 'confirmee' || r.statut === 'terminee')
        .reduce((s, r) => s + (r.prixTotal ?? 0), 0);
    });
  }

  publierAnnonce(): void {
    this.erreurCreation = '';
    const photo = this.photoUrl.trim() ||
      this.PHOTOS_DEFAUT[Math.floor(Math.random() * this.PHOTOS_DEFAUT.length)];
    this.nouvelleAnnonce.photos = [photo];

    const delaiMap: Record<string, number> = { flexible: 1, moderee: 5, stricte: 14 };
    (this.nouvelleAnnonce as any).politiqueAnnulation.delaiRemboursement =
      delaiMap[(this.nouvelleAnnonce as any).politiqueAnnulation.type] ?? 5;

    this.annonceService.creer(this.nouvelleAnnonce as Annonce).subscribe({
      next: () => {
        this.annonceCreee = true;
        this.afficherFormulaire = false;
        this.photoUrl = '';
        this.nouvelleAnnonce = {
          titre: '', description: '', type: 'appartement',
          prixParNuit: 0, maxVoyageurs: 1,
          hoteId: this.auth.currentUser?.userId ?? '',
          localisation: { ville: '', pays: 'Maroc', coordonnees: undefined },
          photos: [], equipements: [],
          caracteristiques: { wifi: false, climatisation: false, cuisine: false, parking: false, piscine: false, jacuzzi: false, animaux: false },
          politiqueAnnulation: { type: 'flexible', delaiRemboursement: 1 }
        };
        this.chargerDonnees();
        setTimeout(() => this.annonceCreee = false, 4000);
      },
      error: err => {
        this.erreurCreation = err.error?.message ?? err.error?.erreur ?? 'Erreur lors de la publication. Vérifiez les champs obligatoires.';
      }
    });
  }

  supprimerAnnonce(id: string): void {
    if (!confirm('Supprimer cette annonce ?')) return;
    this.annonceService.supprimer(id).subscribe(() => this.chargerDonnees());
  }

  changerStatut(id: string, statut: string): void {
    this.reservationService.changerStatut(id, statut).subscribe(() => this.chargerDonnees());
  }

  formulaireValide(): boolean {
    return !!(
      this.nouvelleAnnonce.titre && this.nouvelleAnnonce.titre.length >= 3 &&
      this.nouvelleAnnonce.description && this.nouvelleAnnonce.description.length >= 10 &&
      this.nouvelleAnnonce.prixParNuit! > 0 &&
      this.nouvelleAnnonce.localisation?.ville
    );
  }

  titreAnnonce(annonceId: string): string {
    return this.annonces.find(a => a.id === annonceId)?.titre ?? annonceId.slice(-4);
  }

  statutFr(statut?: string): string {
    const map: Record<string, string> = {
      en_attente: 'En attente', confirmee: 'Confirmée',
      annulee: 'Annulée', terminee: 'Terminée'
    };
    return statut ? (map[statut] ?? statut) : '';
  }
}
