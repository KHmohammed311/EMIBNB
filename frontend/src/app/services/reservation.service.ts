import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private readonly baseUrl = `${environment.apiUrl}/api/reservations`;

  constructor(private http: HttpClient) {}

  lister(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.baseUrl);
  }

  detail(id: string): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.baseUrl}/${id}`);
  }

  creer(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(this.baseUrl, reservation);
  }

  changerStatut(id: string, statut: string): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.baseUrl}/${id}/statut`, { statut });
  }

  supprimer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
