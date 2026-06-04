import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AnnonceService } from '../../services/annonce.service';
import { ReservationService } from '../../services/reservation.service';
import { AuthService } from '../../services/auth.service';
import { User, Annonce, Reservation } from '../../models/models';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="profil-container">
      <div *ngIf="chargement" class="chargement">Chargement...</div>

      <div *ngIf="!chargement && user" class="profil-grid">

        <!-- Sidebar utilisateur -->
        <aside class="profil-sidebar">
          <img [src]="user.avatar || 'assets/avatar.jpg'" [alt]="user.name" class="avatar" />
          <h2>{{ user.name }}</h2>
          <p class="role-badge" [class.hote]="user.role === 'hote'">
            {{ user.role === 'hote' ? '🏠 Hôte' : '✈️ Voyageur' }}
          </p>
          <div class="profil-stats" *ngIf="user.avgRating">
            <div class="stat">
              <strong>⭐ {{ user.avgRating }}</strong>
              <span>Note moyenne</span>
            </div>
          </div>
          <div class="profil-info">
            <p>📧 {{ user.email }}</p>
            <p *ngIf="user.memberSince">
              📅 Membre depuis {{ user.memberSince | date:'MMMM yyyy':'':'fr' }}
            </p>
            <div *ngIf="user.languages?.length" class="langues">
              <strong>Langues :</strong>
              <span *ngFor="let l of user.languages">{{ l }}</span>
            </div>
          </div>
        </aside>

        <!-- Contenu principal -->
        <main class="profil-main">

          <!-- Annonces publiées -->
          <section *ngIf="annonces.length > 0" class="section-annonces">
            <h3>Mes annonces</h3>
            <div *ngIf="annonces.length === 0" class="vide">
              Vous n'avez pas encore d'annonces.
            </div>
            <div class="annonces-mini-grid">
              <div *ngFor="let a of annonces" class="mini-card" [routerLink]="['/annonces', a.id]">
                <img [src]="a.photos?.[0] || 'assets/placeholder.jpg'" [alt]="a.titre" />
                <div class="mini-info">
                  <strong>{{ a.titre }}</strong>
                  <p>{{ a.localisation.ville }} · {{ a.prixParNuit | number }} MAD/nuit</p>
                  <p class="mini-note" *ngIf="a.noteMoyenne">⭐ {{ a.noteMoyenne }} ({{ a.nbAvis }} avis)</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Réservations -->
          <section class="section-reservations">
            <h3>Mes réservations</h3>
            <div *ngIf="reservations.length === 0" class="vide">
              Aucune réservation pour l'instant.
            </div>
            <div class="reserv-list">
              <div *ngFor="let r of reservations" class="reserv-item">
                <div class="reserv-dates">
                  <strong>{{ r.dateArrivee | date:'dd/MM/yyyy' }}</strong>
                  <span>→</span>
                  <strong>{{ r.dateDepart | date:'dd/MM/yyyy' }}</strong>
                </div>
                <div class="reserv-info">
                  <span class="statut-badge" [class]="r.statut">{{ statutFr(r.statut) }}</span>
                  <span class="reserv-prix">{{ r.prixTotal | number }} MAD</span>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .profil-container { max-width:1000px; margin:0 auto; padding:2rem; }
    .chargement { text-align:center; padding:3rem; color:#717171; }
    .profil-grid { display:grid; grid-template-columns:280px 1fr; gap:3rem; }

    .profil-sidebar { text-align:center; }
    .avatar { width:120px; height:120px; border-radius:50%; object-fit:cover;
      box-shadow:0 4px 16px rgba(0,0,0,.15); margin-bottom:1rem; }
    .profil-sidebar h2 { font-size:1.4rem; margin-bottom:.3rem; }
    .role-badge { display:inline-block; border:1px solid #ddd; border-radius:20px;
      padding:.3rem 1rem; font-size:.85rem; }
    .role-badge.hote { background:#fff3f6; border-color:#FF385C; color:#FF385C; }
    .profil-stats { display:flex; justify-content:center; margin:1rem 0; }
    .stat { display:flex; flex-direction:column; align-items:center; padding:1rem; }
    .stat strong { font-size:1.2rem; }
    .stat span   { font-size:.8rem; color:#717171; }
    .profil-info { text-align:left; margin-top:1rem; }
    .profil-info p { margin:.5rem 0; color:#555; font-size:.9rem; }
    .langues { margin-top:.5rem; font-size:.9rem; }
    .langues span { margin-left:.4rem; background:#f0f0f0; border-radius:12px;
      padding:.15rem .6rem; font-size:.8rem; }

    h3 { font-size:1.2rem; margin-bottom:1rem; border-bottom:1px solid #eee; padding-bottom:.5rem; }
    .vide { color:#717171; font-style:italic; padding:1rem 0; }
    .section-annonces { margin-bottom:2.5rem; }
    .annonces-mini-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:1rem; }
    .mini-card { border:1px solid #eee; border-radius:10px; overflow:hidden;
      cursor:pointer; transition:box-shadow .2s; }
    .mini-card:hover { box-shadow:0 4px 14px rgba(0,0,0,.12); }
    .mini-card img { width:100%; height:120px; object-fit:cover; }
    .mini-info { padding:.7rem; }
    .mini-info strong { font-size:.9rem; display:block; }
    .mini-info p { color:#717171; font-size:.8rem; margin:.2rem 0; }
    .mini-note { color:#555; }

    .reserv-list { display:flex; flex-direction:column; gap:.8rem; }
    .reserv-item { border:1px solid #eee; border-radius:10px; padding:1rem;
      display:flex; justify-content:space-between; align-items:center; }
    .reserv-dates { display:flex; gap:.7rem; align-items:center; font-size:.95rem; }
    .reserv-info { display:flex; gap:1rem; align-items:center; }
    .reserv-prix { font-weight:600; }
    .statut-badge { border-radius:20px; padding:.2rem .8rem; font-size:.8rem; }
    .statut-badge.confirmee  { background:#e0f7e9; color:#1a7a3f; }
    .statut-badge.en_attente { background:#fff3e0; color:#e65100; }
    .statut-badge.annulee    { background:#fde8e8; color:#c0392b; }
    .statut-badge.terminee   { background:#f0f0f0; color:#555; }
  `]
})
export class ProfilComponent implements OnInit {
  user: User | null = null;
  annonces: Annonce[] = [];
  reservations: Reservation[] = [];
  chargement = true;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private annonceService: AnnonceService,
    private reservationService: ReservationService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const routeId = this.route.snapshot.paramMap.get('id');
    const id = routeId ?? this.auth.currentUser?.userId ?? '';
    this.userService.profil(id).subscribe({
      next: user => {
        this.user = user;
        this.chargement = false;
        // Annonces publiées par cet utilisateur (hôte ou pas)
        this.annonceService.lister().subscribe(all =>
          this.annonces = all.filter(a => a.hoteId === user.id)
        );
        // Réservations faites PAR cet utilisateur (ses voyages)
        this.reservationService.mesReservations(user.id!).subscribe(data =>
          this.reservations = data
        );
      },
      error: () => { this.chargement = false; }
    });
  }

  statutFr(statut?: string): string {
    const map: Record<string, string> = {
      en_attente: 'En attente', confirmee: 'Confirmée',
      annulee: 'Annulée', terminee: 'Terminée'
    };
    return statut ? (map[statut] ?? statut) : '';
  }
}
