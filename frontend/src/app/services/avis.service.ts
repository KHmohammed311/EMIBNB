import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Avis } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AvisService {
  private readonly baseUrl = `${environment.apiUrl}/api/avis`;

  constructor(private http: HttpClient) {}

  listerParCible(cibleType: string, cibleId: string): Observable<Avis[]> {
    return this.http.get<Avis[]>(`${this.baseUrl}/${cibleType}/${cibleId}`);
  }

  creer(avis: Avis): Observable<Avis> {
    return this.http.post<Avis>(this.baseUrl, avis);
  }

  supprimer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
