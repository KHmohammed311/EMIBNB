// ============================================================
// Interfaces TypeScript — correspond exactement au schéma MongoDB
// ============================================================

export interface Localisation {
  ville: string;
  pays: string;
  coordonnees?: [number, number];
}

export interface Caracteristiques {
  piscine?: boolean;
  parking?: boolean;
  wifi?: boolean;
  climatisation?: boolean;
  cuisine?: boolean;
  animaux?: boolean;
  jacuzzi?: boolean;
}

export interface PolitiqueAnnulation {
  type: 'flexible' | 'moderee' | 'stricte';
  delaiRemboursement: number;
}

export interface AvisEmbed {
  auteurId: string;
  auteurNom: string;
  note: number;
  commentaire: string;
  createdAt: string;
}

export interface Annonce {
  id?: string;
  titre: string;
  description: string;
  hoteId: string;
  type: 'appartement' | 'maison' | 'chambre' | 'villa';
  prixParNuit: number;
  maxVoyageurs: number;
  photos: string[];
  equipements: string[];
  localisation: Localisation;
  caracteristiques?: Caracteristiques;
  politiqueAnnulation?: PolitiqueAnnulation;
  noteMoyenne?: number;
  nbAvis?: number;
  topAvis?: AvisEmbed[];
}

export interface User {
  id?: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'hote' | 'voyageur';
  avatar?: string;
  languages?: string[];
  memberSince?: string;
  avgRating?: number;
}

export interface Reservation {
  id?: string;
  annonceId: string;
  voyageurId: string;
  dateArrivee: string;
  dateDepart: string;
  prixTotal?: number;
  statut?: 'en_attente' | 'confirmee' | 'annulee' | 'terminee';
  nbVoyageurs: number;
  fraisAnnulation?: number;
  createdAt?: string;
}

export interface Avis {
  id?: string;
  cibleId: string;
  cibleType: 'annonce' | 'activite';
  auteurId: string;
  auteurNom?: string;
  reservationId: string;
  note: number;
  commentaire: string;
  createdAt?: string;
}

export interface Activite {
  id?: string;
  titre: string;
  hoteId: string;
  ville: string;
  prix: number;
  duree: number;
  maxParticipants: number;
  categorie: string;
  photos?: string[];
  noteMoyenne?: number;
}

export interface ActiviteReservation {
  id?: string;
  activiteId: string;
  voyageurId: string;
  date: string;
  nbParticipants: number;
  prixTotal?: number;
  statut?: 'en_attente' | 'confirmee' | 'annulee';
}

export interface FiltresRecherche {
  ville?: string;
  dateArrivee?: string;
  dateDepart?: string;
  nbVoyageurs?: number;
  prixMin?: number;
  prixMax?: number;
  type?: string;
}

export interface Recommandation {
  logementId: string;
  titre?: string;
  ville: string;
  prixParNuit: number;
  score?: number;
  scoreCompatibilite: number;
  caracteristiquesCommunes: string[];
}
