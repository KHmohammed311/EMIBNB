// ============================================================
// ÉTAPE 1 — Insertion des données de test
// Exécuter dans mongosh : load("02_insert_data.js")
// ============================================================

use("airbnb_clone");

// ─── IDs réels pour garantir les jointures ($lookup) ────────
const userId1  = new ObjectId("665f000000000000000000a1"); // Hôte — Youssef
const userId2  = new ObjectId("665f000000000000000000a2"); // Hôte — Fatima
const userId3  = new ObjectId("665f000000000000000000a3"); // Voyageur — Mehdi
const userId4  = new ObjectId("665f000000000000000000a4"); // Voyageur — Sofia
const userId5  = new ObjectId("665f000000000000000000a5"); // Voyageur — Karim

const annonceId1 = new ObjectId("665f000000000000000000b1");
const annonceId2 = new ObjectId("665f000000000000000000b2");
const annonceId3 = new ObjectId("665f000000000000000000b3");
const annonceId4 = new ObjectId("665f000000000000000000b4");
const annonceId5 = new ObjectId("665f000000000000000000b5");
const annonceId6 = new ObjectId("665f000000000000000000b6");
const annonceId7 = new ObjectId("665f000000000000000000b7");
const annonceId8 = new ObjectId("665f000000000000000000b8");

const reservId1  = new ObjectId("665f000000000000000000c1");
const reservId2  = new ObjectId("665f000000000000000000c2");
const reservId3  = new ObjectId("665f000000000000000000c3");
const reservId4  = new ObjectId("665f000000000000000000c4");
const reservId5  = new ObjectId("665f000000000000000000c5");
const reservId6  = new ObjectId("665f000000000000000000c6");
const reservId7  = new ObjectId("665f000000000000000000c7");
const reservId8  = new ObjectId("665f000000000000000000c8");
const reservId9  = new ObjectId("665f000000000000000000c9");
const reservId10 = new ObjectId("665f000000000000000000ca");

const activiteId1 = new ObjectId("665f000000000000000000d1");
const activiteId2 = new ObjectId("665f000000000000000000d2");
const activiteId3 = new ObjectId("665f000000000000000000d3");
const activiteId4 = new ObjectId("665f000000000000000000d4");

// ════════════════════════════════════════════════════════════
// 1. USERS (5 utilisateurs)
// ════════════════════════════════════════════════════════════
db.users.insertMany([
  {
    _id: userId1,
    name: "Youssef El Amrani",
    email: "youssef@airbnb-clone.ma",
    passwordHash: "$2b$10$Hashed_password_youssef",
    role: "hote",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    languages: ["Arabe", "Français", "Anglais"],
    memberSince: new Date("2021-03-15"),
    avgRating: 4.8
  },
  {
    _id: userId2,
    name: "Fatima Zahra Benali",
    email: "fatima@airbnb-clone.ma",
    passwordHash: "$2b$10$Hashed_password_fatima",
    role: "hote",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    languages: ["Arabe", "Français"],
    memberSince: new Date("2020-07-22"),
    avgRating: 4.6
  },
  {
    _id: userId3,
    name: "Mehdi Bouchaib",
    email: "mehdi@airbnb-clone.ma",
    passwordHash: "$2b$10$Hashed_password_mehdi",
    role: "voyageur",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    languages: ["Arabe", "Français"],
    memberSince: new Date("2022-01-10"),
    avgRating: 4.9
  },
  {
    _id: userId4,
    name: "Sofia Cherkaoui",
    email: "sofia@airbnb-clone.ma",
    passwordHash: "$2b$10$Hashed_password_sofia",
    role: "voyageur",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    languages: ["Arabe", "Français", "Espagnol"],
    memberSince: new Date("2022-06-05"),
    avgRating: 4.7
  },
  {
    _id: userId5,
    name: "Karim Idrissi",
    email: "karim@airbnb-clone.ma",
    passwordHash: "$2b$10$Hashed_password_karim",
    role: "voyageur",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    languages: ["Arabe", "Anglais"],
    memberSince: new Date("2023-02-20"),
    avgRating: 4.5
  }
]);
print("✓ 5 utilisateurs insérés");

// ════════════════════════════════════════════════════════════
// 2. ANNONCES (8 annonces — villes marocaines)
// ════════════════════════════════════════════════════════════
db.annonces.insertMany([
  {
    _id: annonceId1,
    titre: "Appartement moderne au cœur de Casablanca",
    description: "Magnifique appartement entièrement rénové dans le quartier Maarif. Vue sur mer, cuisine équipée, salle de sport dans l'immeuble. Idéal pour les voyageurs d'affaires ou les familles.",
    hoteId: userId1,
    type: "appartement",
    prixParNuit: 450,
    maxVoyageurs: 4,
    photos: ["casa_apt1_01.jpg", "casa_apt1_02.jpg", "casa_apt1_03.jpg"],
    equipements: ["WiFi", "Climatisation", "Cuisine équipée", "Machine à laver", "Parking"],
    localisation: {
      ville: "Casablanca",
      pays: "Maroc",
      coordonnees: [-7.5898, 33.5731]
    },
    caracteristiques: {
      piscine: false, parking: true, wifi: true,
      climatisation: true, cuisine: true, animaux: false, jacuzzi: false
    },
    politiqueAnnulation: { type: "moderee", delaiRemboursement: 5 },
    noteMoyenne: 4.8,
    nbAvis: 3,
    topAvis: [
      {
        auteurId: userId3,
        auteurNom: "Mehdi Bouchaib",
        note: 5,
        commentaire: "Appartement impeccable, hôte très accueillant !",
        createdAt: new Date("2024-02-10")
      }
    ]
  },
  {
    _id: annonceId2,
    titre: "Riad traditionnel dans la médina de Marrakech",
    description: "Authentique riad du 18ème siècle entièrement restauré. Patio central avec fontaine, terrasse panoramique, hammam privatif. Une expérience marocaine unique au cœur de la médina.",
    hoteId: userId2,
    type: "maison",
    prixParNuit: 850,
    maxVoyageurs: 6,
    photos: ["marrakech_riad_01.jpg", "marrakech_riad_02.jpg", "marrakech_riad_03.jpg"],
    equipements: ["WiFi", "Hammam", "Petit-déjeuner inclus", "Terrasse", "Climatisation"],
    localisation: {
      ville: "Marrakech",
      pays: "Maroc",
      coordonnees: [-7.9811, 31.6295]
    },
    caracteristiques: {
      piscine: true, parking: false, wifi: true,
      climatisation: true, cuisine: true, animaux: false, jacuzzi: true
    },
    politiqueAnnulation: { type: "stricte", delaiRemboursement: 14 },
    noteMoyenne: 4.9,
    nbAvis: 3,
    topAvis: [
      {
        auteurId: userId4,
        auteurNom: "Sofia Cherkaoui",
        note: 5,
        commentaire: "Le riad de mes rêves ! Chaque détail est soigné.",
        createdAt: new Date("2024-03-05")
      }
    ]
  },
  {
    _id: annonceId3,
    titre: "Villa avec piscine à Marrakech Palmeraie",
    description: "Villa contemporaine de 400m² avec grande piscine privée, jardin arborisé et barbecue. Personnel de maison disponible sur demande. Parfaite pour les groupes et les célébrations.",
    hoteId: userId1,
    type: "villa",
    prixParNuit: 2200,
    maxVoyageurs: 10,
    photos: ["marrakech_villa_01.jpg", "marrakech_villa_02.jpg"],
    equipements: ["Piscine", "WiFi", "Barbecue", "Jacuzzi", "Salle de jeux", "Parking"],
    localisation: {
      ville: "Marrakech",
      pays: "Maroc",
      coordonnees: [-8.0124, 31.6589]
    },
    caracteristiques: {
      piscine: true, parking: true, wifi: true,
      climatisation: true, cuisine: true, animaux: true, jacuzzi: true
    },
    politiqueAnnulation: { type: "stricte", delaiRemboursement: 21 },
    noteMoyenne: 4.7,
    nbAvis: 2,
    topAvis: []
  },
  {
    _id: annonceId4,
    titre: "Appartement cosy près du quartier Hassan, Rabat",
    description: "Appartement chaleureux à 5 minutes à pied de la Tour Hassan et de la Kasbah des Oudayas. Décoration soignée mêlant modernité et artisanat marocain.",
    hoteId: userId2,
    type: "appartement",
    prixParNuit: 320,
    maxVoyageurs: 2,
    photos: ["rabat_apt_01.jpg", "rabat_apt_02.jpg"],
    equipements: ["WiFi", "Cuisine équipée", "Netflix", "Climatisation"],
    localisation: {
      ville: "Rabat",
      pays: "Maroc",
      coordonnees: [-6.8498, 34.0209]
    },
    caracteristiques: {
      piscine: false, parking: false, wifi: true,
      climatisation: true, cuisine: true, animaux: false, jacuzzi: false
    },
    politiqueAnnulation: { type: "flexible", delaiRemboursement: 1 },
    noteMoyenne: 4.5,
    nbAvis: 2,
    topAvis: []
  },
  {
    _id: annonceId5,
    titre: "Maison d'hôtes dans la médina de Fès",
    description: "Demeure ancestrale au cœur de Fès el-Bali, la plus ancienne médina du monde. 5 chambres, salon marocain, terrasse avec vue sur les tanneries. Un voyage dans le temps.",
    hoteId: userId1,
    type: "maison",
    prixParNuit: 650,
    maxVoyageurs: 8,
    photos: ["fes_maison_01.jpg", "fes_maison_02.jpg", "fes_maison_03.jpg"],
    equipements: ["WiFi", "Petit-déjeuner inclus", "Terrasse", "Cuisine marocaine"],
    localisation: {
      ville: "Fès",
      pays: "Maroc",
      coordonnees: [-5.0078, 34.0333]
    },
    caracteristiques: {
      piscine: false, parking: false, wifi: true,
      climatisation: false, cuisine: true, animaux: false, jacuzzi: false
    },
    politiqueAnnulation: { type: "moderee", delaiRemboursement: 7 },
    noteMoyenne: 4.6,
    nbAvis: 2,
    topAvis: []
  },
  {
    _id: annonceId6,
    titre: "Chambre privée dans riad — Marrakech centre",
    description: "Chambre confortable dans un riad familial authentique. Petit-déjeuner marocain inclus : msemen, amlou, thé à la menthe. Accès à la terrasse et au salon commun.",
    hoteId: userId2,
    type: "chambre",
    prixParNuit: 180,
    maxVoyageurs: 2,
    photos: ["marrakech_chambre_01.jpg"],
    equipements: ["WiFi", "Petit-déjeuner inclus", "Climatisation"],
    localisation: {
      ville: "Marrakech",
      pays: "Maroc",
      coordonnees: [-7.9856, 31.6315]
    },
    caracteristiques: {
      piscine: false, parking: false, wifi: true,
      climatisation: true, cuisine: false, animaux: false, jacuzzi: false
    },
    politiqueAnnulation: { type: "flexible", delaiRemboursement: 1 },
    noteMoyenne: 4.3,
    nbAvis: 2,
    topAvis: []
  },
  {
    _id: annonceId7,
    titre: "Studio design — Casablanca Anfa",
    description: "Studio entièrement équipé dans le quartier Anfa, à 10 minutes des plages. Design minimaliste, cuisine américaine, terrasse privée. Idéal pour un séjour en solo ou en couple.",
    hoteId: userId1,
    type: "appartement",
    prixParNuit: 280,
    maxVoyageurs: 2,
    photos: ["casa_studio_01.jpg", "casa_studio_02.jpg"],
    equipements: ["WiFi", "Cuisine équipée", "Terrasse", "Climatisation"],
    localisation: {
      ville: "Casablanca",
      pays: "Maroc",
      coordonnees: [-7.6380, 33.5950]
    },
    caracteristiques: {
      piscine: false, parking: true, wifi: true,
      climatisation: true, cuisine: true, animaux: false, jacuzzi: false
    },
    politiqueAnnulation: { type: "flexible", delaiRemboursement: 2 },
    noteMoyenne: 4.4,
    nbAvis: 1,
    topAvis: []
  },
  {
    _id: annonceId8,
    titre: "Villa de luxe avec vue mer — Mohammedia",
    description: "Superbe villa contemporaine face à l'océan Atlantique. 4 chambres, piscine à débordement, accès direct à la plage privée. Personnel de service inclus.",
    hoteId: userId2,
    type: "villa",
    prixParNuit: 3500,
    maxVoyageurs: 8,
    photos: ["mohamm_villa_01.jpg", "mohamm_villa_02.jpg", "mohamm_villa_03.jpg"],
    equipements: ["Piscine", "WiFi", "Plage privée", "Jacuzzi", "Chef à domicile", "Parking"],
    localisation: {
      ville: "Mohammedia",
      pays: "Maroc",
      coordonnees: [-7.3832, 33.6860]
    },
    caracteristiques: {
      piscine: true, parking: true, wifi: true,
      climatisation: true, cuisine: true, animaux: true, jacuzzi: true
    },
    politiqueAnnulation: { type: "stricte", delaiRemboursement: 30 },
    noteMoyenne: 4.9,
    nbAvis: 1,
    topAvis: []
  }
]);
print("✓ 8 annonces insérées");

// ════════════════════════════════════════════════════════════
// 3. RESERVATIONS (10 réservations)
// ════════════════════════════════════════════════════════════
db.reservations.insertMany([
  {
    _id: reservId1,
    annonceId: annonceId1,
    voyageurId: userId3,
    dateArrivee: new Date("2024-02-01"),
    dateDepart: new Date("2024-02-07"),
    prixTotal: 2700,
    statut: "terminee",
    nbVoyageurs: 2,
    fraisAnnulation: 0,
    createdAt: new Date("2024-01-20")
  },
  {
    _id: reservId2,
    annonceId: annonceId2,
    voyageurId: userId4,
    dateArrivee: new Date("2024-03-01"),
    dateDepart: new Date("2024-03-05"),
    prixTotal: 3400,
    statut: "terminee",
    nbVoyageurs: 4,
    fraisAnnulation: 0,
    createdAt: new Date("2024-02-15")
  },
  {
    _id: reservId3,
    annonceId: annonceId3,
    voyageurId: userId5,
    dateArrivee: new Date("2024-04-10"),
    dateDepart: new Date("2024-04-17"),
    prixTotal: 15400,
    statut: "confirmee",
    nbVoyageurs: 8,
    fraisAnnulation: 0,
    createdAt: new Date("2024-03-25")
  },
  {
    _id: reservId4,
    annonceId: annonceId4,
    voyageurId: userId3,
    dateArrivee: new Date("2024-05-15"),
    dateDepart: new Date("2024-05-20"),
    prixTotal: 1600,
    statut: "confirmee",
    nbVoyageurs: 2,
    fraisAnnulation: 0,
    createdAt: new Date("2024-05-01")
  },
  {
    _id: reservId5,
    annonceId: annonceId5,
    voyageurId: userId4,
    dateArrivee: new Date("2024-06-01"),
    dateDepart: new Date("2024-06-08"),
    prixTotal: 4550,
    statut: "terminee",
    nbVoyageurs: 6,
    fraisAnnulation: 0,
    createdAt: new Date("2024-05-10")
  },
  {
    _id: reservId6,
    annonceId: annonceId1,
    voyageurId: userId5,
    dateArrivee: new Date("2024-07-10"),
    dateDepart: new Date("2024-07-15"),
    prixTotal: 2250,
    statut: "annulee",
    nbVoyageurs: 3,
    fraisAnnulation: 225,
    createdAt: new Date("2024-06-20")
  },
  {
    _id: reservId7,
    annonceId: annonceId6,
    voyageurId: userId3,
    dateArrivee: new Date("2024-08-01"),
    dateDepart: new Date("2024-08-05"),
    prixTotal: 720,
    statut: "terminee",
    nbVoyageurs: 2,
    fraisAnnulation: 0,
    createdAt: new Date("2024-07-15")
  },
  {
    _id: reservId8,
    annonceId: annonceId7,
    voyageurId: userId4,
    dateArrivee: new Date("2024-09-20"),
    dateDepart: new Date("2024-09-25"),
    prixTotal: 1400,
    statut: "confirmee",
    nbVoyageurs: 2,
    fraisAnnulation: 0,
    createdAt: new Date("2024-09-01")
  },
  {
    _id: reservId9,
    annonceId: annonceId8,
    voyageurId: userId5,
    dateArrivee: new Date("2024-10-05"),
    dateDepart: new Date("2024-10-10"),
    prixTotal: 17500,
    statut: "en_attente",
    nbVoyageurs: 6,
    fraisAnnulation: 0,
    createdAt: new Date("2024-09-28")
  },
  {
    _id: reservId10,
    annonceId: annonceId2,
    voyageurId: userId3,
    dateArrivee: new Date("2024-12-20"),
    dateDepart: new Date("2024-12-31"),
    prixTotal: 9350,
    statut: "confirmee",
    nbVoyageurs: 4,
    fraisAnnulation: 0,
    createdAt: new Date("2024-11-01")
  }
]);
print("✓ 10 réservations insérées");

// ════════════════════════════════════════════════════════════
// 4. AVIS (15 avis)
// ════════════════════════════════════════════════════════════
db.avis.insertMany([
  // Avis sur l'annonce 1 (Casablanca)
  { _id: new ObjectId(), cibleId: annonceId1, cibleType: "annonce", auteurId: userId3, reservationId: reservId1, note: 5, commentaire: "Appartement impeccable, hôte très accueillant !", createdAt: new Date("2024-02-10") },
  { _id: new ObjectId(), cibleId: annonceId1, cibleType: "annonce", auteurId: userId4, reservationId: reservId1, note: 5, commentaire: "Excellent séjour, tout était parfait. Je recommande vivement.", createdAt: new Date("2024-02-12") },
  { _id: new ObjectId(), cibleId: annonceId1, cibleType: "annonce", auteurId: userId5, reservationId: reservId6, note: 4, commentaire: "Très bon appartement, emplacement idéal.", createdAt: new Date("2024-02-15") },

  // Avis sur l'annonce 2 (Marrakech riad)
  { _id: new ObjectId(), cibleId: annonceId2, cibleType: "annonce", auteurId: userId4, reservationId: reservId2, note: 5, commentaire: "Le riad de mes rêves ! Chaque détail est soigné.", createdAt: new Date("2024-03-05") },
  { _id: new ObjectId(), cibleId: annonceId2, cibleType: "annonce", auteurId: userId3, reservationId: reservId2, note: 5, commentaire: "Expérience inoubliable, le hammam est magnifique.", createdAt: new Date("2024-03-08") },
  { _id: new ObjectId(), cibleId: annonceId2, cibleType: "annonce", auteurId: userId5, reservationId: reservId10, note: 5, commentaire: "Parfait pour Noël à Marrakech, service impeccable.", createdAt: new Date("2024-03-10") },

  // Avis sur l'annonce 3 (Villa Marrakech)
  { _id: new ObjectId(), cibleId: annonceId3, cibleType: "annonce", auteurId: userId5, reservationId: reservId3, note: 5, commentaire: "Villa de rêve, piscine chauffée, accueil parfait.", createdAt: new Date("2024-04-20") },
  { _id: new ObjectId(), cibleId: annonceId3, cibleType: "annonce", auteurId: userId3, reservationId: reservId3, note: 4, commentaire: "Superbe villa, quelques petits détails à améliorer.", createdAt: new Date("2024-04-22") },

  // Avis sur l'annonce 4 (Rabat)
  { _id: new ObjectId(), cibleId: annonceId4, cibleType: "annonce", auteurId: userId3, reservationId: reservId4, note: 4, commentaire: "Appartement bien situé, propre et fonctionnel.", createdAt: new Date("2024-05-22") },
  { _id: new ObjectId(), cibleId: annonceId4, cibleType: "annonce", auteurId: userId5, reservationId: reservId4, note: 5, commentaire: "Parfait pour visiter Rabat, hôte disponible et sympa.", createdAt: new Date("2024-05-25") },

  // Avis sur l'annonce 5 (Fès)
  { _id: new ObjectId(), cibleId: annonceId5, cibleType: "annonce", auteurId: userId4, reservationId: reservId5, note: 5, commentaire: "La médina de Fès est magique, cette maison d'hôtes est idéale.", createdAt: new Date("2024-06-10") },
  { _id: new ObjectId(), cibleId: annonceId5, cibleType: "annonce", auteurId: userId3, reservationId: reservId5, note: 4, commentaire: "Très belle expérience authentique dans la médina.", createdAt: new Date("2024-06-12") },

  // Avis sur l'annonce 6 (Chambre Marrakech)
  { _id: new ObjectId(), cibleId: annonceId6, cibleType: "annonce", auteurId: userId3, reservationId: reservId7, note: 4, commentaire: "Chambre confortable, petit-déjeuner délicieux.", createdAt: new Date("2024-08-07") },
  { _id: new ObjectId(), cibleId: annonceId6, cibleType: "annonce", auteurId: userId4, reservationId: reservId7, note: 4, commentaire: "Bon rapport qualité-prix pour Marrakech centre.", createdAt: new Date("2024-08-09") },

  // Avis sur une activité
  { _id: new ObjectId(), cibleId: activiteId1, cibleType: "activite", auteurId: userId3, reservationId: reservId5, note: 5, commentaire: "Visite guidée de la médina exceptionnelle, guide très cultivé.", createdAt: new Date("2024-06-15") }
]);
print("✓ 15 avis insérés");

// ════════════════════════════════════════════════════════════
// 5. ACTIVITES (4 activités)
// ════════════════════════════════════════════════════════════
db.activites.insertMany([
  {
    _id: activiteId1,
    titre: "Visite guidée de la médina de Fès",
    hoteId: userId1,
    ville: "Fès",
    prix: 150,
    duree: 180,
    maxParticipants: 8,
    categorie: "Culture & Histoire",
    photos: ["fes_visite_01.jpg", "fes_visite_02.jpg"],
    noteMoyenne: 4.9
  },
  {
    _id: activiteId2,
    titre: "Cours de cuisine marocaine à Marrakech",
    hoteId: userId2,
    ville: "Marrakech",
    prix: 250,
    duree: 240,
    maxParticipants: 6,
    categorie: "Gastronomie",
    photos: ["marrakech_cuisine_01.jpg"],
    noteMoyenne: 4.7
  },
  {
    _id: activiteId3,
    titre: "Excursion dans les dunes d'Agafay",
    hoteId: userId1,
    ville: "Marrakech",
    prix: 400,
    duree: 360,
    maxParticipants: 12,
    categorie: "Aventure & Nature",
    photos: ["agafay_01.jpg", "agafay_02.jpg"],
    noteMoyenne: 4.8
  },
  {
    _id: activiteId4,
    titre: "Surf & yoga — côte atlantique de Casablanca",
    hoteId: userId2,
    ville: "Casablanca",
    prix: 200,
    duree: 120,
    maxParticipants: 10,
    categorie: "Sport & Bien-être",
    photos: ["casa_surf_01.jpg"],
    noteMoyenne: 4.6
  }
]);
print("✓ 4 activités insérées");

// ════════════════════════════════════════════════════════════
// 6. ACTIVITE_RESERVATIONS (6 réservations d'activités)
// ════════════════════════════════════════════════════════════
db.activite_reservations.insertMany([
  {
    _id: new ObjectId(),
    activiteId: activiteId1,
    voyageurId: userId3,
    date: new Date("2024-06-09"),
    nbParticipants: 2,
    prixTotal: 300,
    statut: "confirmee"
  },
  {
    _id: new ObjectId(),
    activiteId: activiteId2,
    voyageurId: userId4,
    date: new Date("2024-03-03"),
    nbParticipants: 3,
    prixTotal: 750,
    statut: "confirmee"
  },
  {
    _id: new ObjectId(),
    activiteId: activiteId3,
    voyageurId: userId5,
    date: new Date("2024-04-14"),
    nbParticipants: 4,
    prixTotal: 1600,
    statut: "confirmee"
  },
  {
    _id: new ObjectId(),
    activiteId: activiteId4,
    voyageurId: userId3,
    date: new Date("2024-09-22"),
    nbParticipants: 2,
    prixTotal: 400,
    statut: "en_attente"
  },
  {
    _id: new ObjectId(),
    activiteId: activiteId1,
    voyageurId: userId5,
    date: new Date("2024-10-08"),
    nbParticipants: 2,
    prixTotal: 300,
    statut: "annulee"
  },
  {
    _id: new ObjectId(),
    activiteId: activiteId2,
    voyageurId: userId3,
    date: new Date("2024-12-22"),
    nbParticipants: 2,
    prixTotal: 500,
    statut: "en_attente"
  }
]);
print("✓ 6 réservations d'activités insérées");

print("\n═══════════════════════════════════════════════════════");
print("✓ Toutes les données de test insérées avec succès !");
print("═══════════════════════════════════════════════════════");
