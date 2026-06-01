import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Annonce, FiltresRecherche } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AnnonceService {
  private readonly baseUrl = `${environment.apiUrl}/api/annonces`;

  constructor(private http: HttpClient) {}

  lister(filtres?: FiltresRecherche): Observable<Annonce[]> {
    let params = new HttpParams();
    if (filtres?.ville)       params = params.set('ville', filtres.ville);
    if (filtres?.prixMin)     params = params.set('prixMin', filtres.prixMin);
    if (filtres?.prixMax)     params = params.set('prixMax', filtres.prixMax);
    if (filtres?.type)        params = params.set('type', filtres.type);
    if (filtres?.nbVoyageurs) params = params.set('nbVoyageurs', filtres.nbVoyageurs);
    return this.http.get<Annonce[]>(this.baseUrl, { params });
  }

  detail(id: string): Observable<Annonce> {
    return this.http.get<Annonce>(`${this.baseUrl}/${id}`);
  }

  top5(): Observable<Annonce[]> {
    return this.http.get<Annonce[]>(`${this.baseUrl}/top`);
  }

  creer(annonce: Annonce): Observable<Annonce> {
    return this.http.post<Annonce>(this.baseUrl, annonce);
  }

  modifier(id: string, annonce: Annonce): Observable<Annonce> {
    return this.http.put<Annonce>(`${this.baseUrl}/${id}`, annonce);
  }

  supprimer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
