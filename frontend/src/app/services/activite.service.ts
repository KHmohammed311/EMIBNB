import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Activite, ActiviteReservation } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ActiviteService {
  private readonly baseUrl      = `${environment.apiUrl}/api/activites`;
  private readonly reservUrl    = `${environment.apiUrl}/api/activite-reservations`;

  constructor(private http: HttpClient) {}

  lister(ville?: string, categorie?: string): Observable<Activite[]> {
    let params = new HttpParams();
    if (ville)     params = params.set('ville', ville);
    if (categorie) params = params.set('categorie', categorie);
    return this.http.get<Activite[]>(this.baseUrl, { params });
  }

  detail(id: string): Observable<Activite> {
    return this.http.get<Activite>(`${this.baseUrl}/${id}`);
  }

  creer(activite: Activite): Observable<Activite> {
    return this.http.post<Activite>(this.baseUrl, activite);
  }

  modifier(id: string, activite: Activite): Observable<Activite> {
    return this.http.put<Activite>(`${this.baseUrl}/${id}`, activite);
  }

  supprimer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  reserverActivite(reservation: ActiviteReservation): Observable<ActiviteReservation> {
    return this.http.post<ActiviteReservation>(this.reservUrl, reservation);
  }

  changerStatutReservation(id: string, statut: string): Observable<ActiviteReservation> {
    return this.http.put<ActiviteReservation>(`${this.reservUrl}/${id}/statut`, { statut });
  }
}
