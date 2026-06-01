import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recommandation } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RecommandationService {
  private readonly baseUrl = `${environment.apiUrl}/api/recommandations`;

  constructor(private http: HttpClient) {}

  recommanderPourVoyageur(userId: string): Observable<Recommandation[]> {
    return this.http.get<Recommandation[]>(`${this.baseUrl}/${userId}`);
  }

  logementsSimilaires(annonceId: string): Observable<Recommandation[]> {
    return this.http.get<Recommandation[]>(`${this.baseUrl}/similaires/${annonceId}`);
  }
}
