// ============================================================
// ÉTAPE 1 — Insertion des données de test
// Exécuter dans mongosh : load("02_insert_data.js")
// ============================================================

use("airbnb_clone");

// ─── IDs réels pour garantir les jointures ($lookup) ────────
const userId1  = new ObjectId("665f000000000000000000a1"); // Admin        (login: admin)
const userId2  = new ObjectId("665f000000000000000000a2"); // Utilisateur2 (login: user2)
const userId3  = new ObjectId("665f000000000000000000a3"); // Mohammed Khelifi  (login: khelifi)
const userId4  = new ObjectId("665f000000000000000000a4"); // Hamza Mantrach    (login: mantrach)
const userId5  = new ObjectId("665f000000000000000000a5"); // Anass Gharbi      (login: gharbi)

const annonceId1 = new ObjectId("665f000000000000000000b1");
const annonceId2 = new ObjectId("665f000000000000000000b2");
const annonceId3 = new ObjectId("665f000000000000000000b3");
const annonceId4 = new ObjectId("665f000000000000000000b4");
const annonceId5 = new ObjectId("665f000000000000000000b5");
const annonceId6 = new ObjectId("665f000000000000000000b6");
const annonceId7 = new ObjectId("665f000000000000000000b7");
const annonceId8 = new ObjectId("665f000000000000000000b8");

// Réservations khelifi (voyageur)
const reservId_k1 = new ObjectId("665f000000000000000000d1");
const reservId_k2 = new ObjectId("665f000000000000000000d2");
const reservId_k3 = new ObjectId("665f000000000000000000d3");
const reservId_k4 = new ObjectId("665f000000000000000000d4");
const reservId_k5 = new ObjectId("665f000000000000000000d5");
const reservId_k6 = new ObjectId("665f000000000000000000d6");
// Réservations mantrach (voyageur)
const reservId_m1 = new ObjectId("665f000000000000000000d7");
const reservId_m2 = new ObjectId("665f000000000000000000d8");
const reservId_m3 = new ObjectId("665f000000000000000000d9");
const reservId_m4 = new ObjectId("665f000000000000000000da");
const reservId_m5 = new ObjectId("665f000000000000000000db");
const reservId_m6 = new ObjectId("665f000000000000000000dc");
// Réservations gharbi (voyageur)
const reservId_g1 = new ObjectId("665f000000000000000000dd");
const reservId_g2 = new ObjectId("665f000000000000000000de");
const reservId_g3 = new ObjectId("665f000000000000000000df");
const reservId_g4 = new ObjectId("665f000000000000000000e0");
const reservId_g5 = new ObjectId("665f000000000000000000e1");
const reservId_g6 = new ObjectId("665f000000000000000000e2");
// Réservations admin (voyageur)
const reservId_a1 = new ObjectId("665f000000000000000000e3");
const reservId_a2 = new ObjectId("665f000000000000000000e4");
const reservId_a3 = new ObjectId("665f000000000000000000e5");
const reservId_a4 = new ObjectId("665f000000000000000000e6");
const reservId_a5 = new ObjectId("665f000000000000000000e7");

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
    name: "Utilisateur 1",
    nom: "Utilisateur 1",
    login: "admin",
    motDePasse: "admin",
    email: "youssef@airbnb-clone.ma",
    passwordHash: "$2b$10$Hashed_password_admin",
    role: "hote",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    languages: ["Arabe", "Français", "Anglais"],
    memberSince: new Date("2021-03-15"),
    avgRating: 4.8
  },
  {
    _id: userId2,
    name: "Fatima Zahra Benali",
    nom: "Utilisateur 2",
    login: "user2",
    motDePasse: "user2",
    email: "fatima@airbnb-clone.ma",
    passwordHash: "$2b$10$Hashed_password_user2",
    role: "hote",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    languages: ["Arabe", "Français"],
    memberSince: new Date("2020-07-22"),
    avgRating: 4.6
  },
  {
    _id: userId3,
    name: "Mohammed Khelifi",
    nom: "Mohammed Khelifi",
    login: "khelifi",
    motDePasse: "khelifi",
    email: "khelifi@emi.ac.ma",
    passwordHash: "$2b$10$Hashed_password_khelifi",
    role: "hote",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    languages: ["Arabe", "Français"],
    memberSince: new Date("2022-01-10"),
    avgRating: 4.9
  },
  {
    _id: userId4,
    name: "Hamza Mantrach",
    nom: "Hamza Mantrach",
    login: "mantrach",
    motDePasse: "mantrach",
    email: "mantrach@emi.ac.ma",
    passwordHash: "$2b$10$Hashed_password_mantrach",
    role: "hote",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
    languages: ["Arabe", "Français"],
    memberSince: new Date("2022-06-05"),
    avgRating: 4.7
  },
  {
    _id: userId5,
    name: "Anass Gharbi",
    nom: "Anass Gharbi",
    login: "gharbi",
    motDePasse: "gharbi",
    email: "gharbi@emi.ac.ma",
    passwordHash: "$2b$10$Hashed_password_gharbi",
    role: "hote",
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
    photos: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800", "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800"],
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
        auteurNom: "Mohammed Khelifi",
        note: 5,
        commentaire: "Appartement impeccable, hôte très accueillant !",
        createdAt: new Date("2026-02-10")
      }
    ]
  },
  {
    _id: annonceId2,
    titre: "Riad traditionnel dans la médina de Marrakech",
    description: "Authentique riad du 18ème siècle entièrement restauré. Patio central avec fontaine, terrasse panoramique, hammam privatif. Une expérience marocaine unique au cœur de la médina.",
    hoteId: userId1,  // admin
    type: "maison",
    prixParNuit: 850,
    maxVoyageurs: 6,
    photos: ["https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800", "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"],
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
        auteurNom: "Hamza Mantrach",
        note: 5,
        commentaire: "Le riad de mes rêves ! Chaque détail est soigné.",
        createdAt: new Date("2026-03-05")
      }
    ]
  },
  {
    _id: annonceId3,
    titre: "Villa avec piscine à Marrakech Palmeraie",
    description: "Villa contemporaine de 400m² avec grande piscine privée, jardin arborisé et barbecue. Personnel de maison disponible sur demande. Parfaite pour les groupes et les célébrations.",
    hoteId: userId3,  // khelifi
    type: "villa",
    prixParNuit: 2200,
    maxVoyageurs: 10,
    photos: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"],
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
    hoteId: userId3,  // khelifi
    type: "appartement",
    prixParNuit: 320,
    maxVoyageurs: 2,
    photos: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"],
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
    hoteId: userId4,  // mantrach
    type: "maison",
    prixParNuit: 650,
    maxVoyageurs: 8,
    photos: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800", "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800"],
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
    hoteId: userId4,  // mantrach
    type: "chambre",
    prixParNuit: 180,
    maxVoyageurs: 2,
    photos: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"],
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
    hoteId: userId5,  // gharbi
    type: "appartement",
    prixParNuit: 280,
    maxVoyageurs: 2,
    photos: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800", "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800"],
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
    hoteId: userId5,  // gharbi
    type: "villa",
    prixParNuit: 3500,
    maxVoyageurs: 8,
    photos: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"],
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
// 3. RESERVATIONS (23 réservations — chaque user réserve chez les AUTRES, jamais chez soi)
// Règle : admin(a1)→b1,b2 | khelifi(a3)→b3,b4 | mantrach(a4)→b5,b6 | gharbi(a5)→b7,b8
// ════════════════════════════════════════════════════════════
db.reservations.insertMany([
  // ── khelifi comme voyageur (réserve chez admin, mantrach, gharbi) ───
  { _id: reservId_k1, annonceId: annonceId2, voyageurId: userId3,
    dateArrivee: new Date("2026-02-01"), dateDepart: new Date("2026-02-07"),
    prixTotal: 5100, statut: "terminee", nbVoyageurs: 2, fraisAnnulation: 0, createdAt: new Date("2026-01-15") },
  { _id: reservId_k2, annonceId: annonceId7, voyageurId: userId3,
    dateArrivee: new Date("2026-03-15"), dateDepart: new Date("2026-03-20"),
    prixTotal: 1400, statut: "terminee", nbVoyageurs: 1, fraisAnnulation: 0, createdAt: new Date("2026-03-01") },
  { _id: reservId_k3, annonceId: annonceId8, voyageurId: userId3,
    dateArrivee: new Date("2026-05-10"), dateDepart: new Date("2026-05-15"),
    prixTotal: 17500, statut: "terminee", nbVoyageurs: 1, fraisAnnulation: 0, createdAt: new Date("2026-04-20") },
  { _id: reservId_k4, annonceId: annonceId1, voyageurId: userId3,
    dateArrivee: new Date("2026-07-01"), dateDepart: new Date("2026-07-06"),
    prixTotal: 2250, statut: "confirmee", nbVoyageurs: 1, fraisAnnulation: 0, createdAt: new Date("2026-06-01") },
  { _id: reservId_k5, annonceId: annonceId6, voyageurId: userId3,
    dateArrivee: new Date("2026-09-01"), dateDepart: new Date("2026-09-05"),
    prixTotal: 720, statut: "confirmee", nbVoyageurs: 1, fraisAnnulation: 0, createdAt: new Date("2026-08-01") },
  { _id: reservId_k6, annonceId: annonceId5, voyageurId: userId3,
    dateArrivee: new Date("2026-11-20"), dateDepart: new Date("2026-11-27"),
    prixTotal: 4550, statut: "en_attente", nbVoyageurs: 2, fraisAnnulation: 0, createdAt: new Date("2026-10-15") },

  // ── mantrach comme voyageur (réserve chez khelifi, admin, gharbi) ───
  { _id: reservId_m1, annonceId: annonceId3, voyageurId: userId4,
    dateArrivee: new Date("2026-02-10"), dateDepart: new Date("2026-02-17"),
    prixTotal: 15400, statut: "terminee", nbVoyageurs: 2, fraisAnnulation: 0, createdAt: new Date("2026-01-20") },
  { _id: reservId_m2, annonceId: annonceId1, voyageurId: userId4,
    dateArrivee: new Date("2026-04-01"), dateDepart: new Date("2026-04-05"),
    prixTotal: 1800, statut: "terminee", nbVoyageurs: 1, fraisAnnulation: 0, createdAt: new Date("2026-03-15") },
  { _id: reservId_m3, annonceId: annonceId7, voyageurId: userId4,
    dateArrivee: new Date("2026-06-20"), dateDepart: new Date("2026-06-25"),
    prixTotal: 1400, statut: "confirmee", nbVoyageurs: 1, fraisAnnulation: 0, createdAt: new Date("2026-06-01") },
  { _id: reservId_m4, annonceId: annonceId8, voyageurId: userId4,
    dateArrivee: new Date("2026-08-05"), dateDepart: new Date("2026-08-10"),
    prixTotal: 17500, statut: "confirmee", nbVoyageurs: 2, fraisAnnulation: 0, createdAt: new Date("2026-07-01") },
  { _id: reservId_m5, annonceId: annonceId4, voyageurId: userId4,
    dateArrivee: new Date("2026-10-01"), dateDepart: new Date("2026-10-06"),
    prixTotal: 1600, statut: "annulee", nbVoyageurs: 1, fraisAnnulation: 160, createdAt: new Date("2026-09-01") },
  { _id: reservId_m6, annonceId: annonceId2, voyageurId: userId4,
    dateArrivee: new Date("2026-12-20"), dateDepart: new Date("2026-12-31"),
    prixTotal: 9350, statut: "confirmee", nbVoyageurs: 2, fraisAnnulation: 0, createdAt: new Date("2026-11-15") },

  // ── gharbi comme voyageur (réserve chez admin, khelifi, mantrach) ───
  { _id: reservId_g1, annonceId: annonceId1, voyageurId: userId5,
    dateArrivee: new Date("2026-03-05"), dateDepart: new Date("2026-03-10"),
    prixTotal: 2250, statut: "terminee", nbVoyageurs: 1, fraisAnnulation: 0, createdAt: new Date("2026-02-15") },
  { _id: reservId_g2, annonceId: annonceId5, voyageurId: userId5,
    dateArrivee: new Date("2026-05-01"), dateDepart: new Date("2026-05-08"),
    prixTotal: 4550, statut: "terminee", nbVoyageurs: 2, fraisAnnulation: 0, createdAt: new Date("2026-04-01") },
  { _id: reservId_g3, annonceId: annonceId3, voyageurId: userId5,
    dateArrivee: new Date("2026-07-10"), dateDepart: new Date("2026-07-17"),
    prixTotal: 15400, statut: "confirmee", nbVoyageurs: 2, fraisAnnulation: 0, createdAt: new Date("2026-06-15") },
  { _id: reservId_g4, annonceId: annonceId6, voyageurId: userId5,
    dateArrivee: new Date("2026-08-15"), dateDepart: new Date("2026-08-20"),
    prixTotal: 900, statut: "confirmee", nbVoyageurs: 1, fraisAnnulation: 0, createdAt: new Date("2026-07-20") },
  { _id: reservId_g5, annonceId: annonceId2, voyageurId: userId5,
    dateArrivee: new Date("2026-11-01"), dateDepart: new Date("2026-11-08"),
    prixTotal: 5950, statut: "en_attente", nbVoyageurs: 2, fraisAnnulation: 0, createdAt: new Date("2026-10-01") },
  { _id: reservId_g6, annonceId: annonceId4, voyageurId: userId5,
    dateArrivee: new Date("2026-12-15"), dateDepart: new Date("2026-12-20"),
    prixTotal: 1600, statut: "confirmee", nbVoyageurs: 1, fraisAnnulation: 0, createdAt: new Date("2026-11-20") },

  // ── admin comme voyageur (réserve chez khelifi, mantrach, gharbi) ───
  { _id: reservId_a1, annonceId: annonceId3, voyageurId: userId1,
    dateArrivee: new Date("2026-04-10"), dateDepart: new Date("2026-04-17"),
    prixTotal: 15400, statut: "terminee", nbVoyageurs: 2, fraisAnnulation: 0, createdAt: new Date("2026-03-20") },
  { _id: reservId_a2, annonceId: annonceId8, voyageurId: userId1,
    dateArrivee: new Date("2026-06-01"), dateDepart: new Date("2026-06-06"),
    prixTotal: 17500, statut: "confirmee", nbVoyageurs: 2, fraisAnnulation: 0, createdAt: new Date("2026-05-15") },
  { _id: reservId_a3, annonceId: annonceId5, voyageurId: userId1,
    dateArrivee: new Date("2026-08-01"), dateDepart: new Date("2026-08-08"),
    prixTotal: 4550, statut: "confirmee", nbVoyageurs: 2, fraisAnnulation: 0, createdAt: new Date("2026-07-10") },
  { _id: reservId_a4, annonceId: annonceId7, voyageurId: userId1,
    dateArrivee: new Date("2026-09-20"), dateDepart: new Date("2026-09-25"),
    prixTotal: 1400, statut: "confirmee", nbVoyageurs: 1, fraisAnnulation: 0, createdAt: new Date("2026-08-25") },
  { _id: reservId_a5, annonceId: annonceId6, voyageurId: userId1,
    dateArrivee: new Date("2026-01-05"), dateDepart: new Date("2026-01-10"),
    prixTotal: 900, statut: "terminee", nbVoyageurs: 1, fraisAnnulation: 0, createdAt: new Date("2025-12-15") }
]);
print("✓ 23 réservations insérées (logique hôte/voyageur respectée)");

// ════════════════════════════════════════════════════════════
// 4. AVIS (15 avis)
// ════════════════════════════════════════════════════════════
db.avis.insertMany([
  // Avis sur l'annonce 1 (Casablanca)
  { _id: new ObjectId(), cibleId: annonceId1, cibleType: "annonce", auteurId: userId3, reservationId: reservId_k4, note: 5, commentaire: "Appartement impeccable, hôte très accueillant !", createdAt: new Date("2026-02-10") },
  { _id: new ObjectId(), cibleId: annonceId1, cibleType: "annonce", auteurId: userId4, reservationId: reservId_k4, note: 5, commentaire: "Excellent séjour, tout était parfait. Je recommande vivement.", createdAt: new Date("2026-02-12") },
  { _id: new ObjectId(), cibleId: annonceId1, cibleType: "annonce", auteurId: userId5, reservationId: reservId_g1, note: 4, commentaire: "Très bon appartement, emplacement idéal.", createdAt: new Date("2026-02-15") },

  // Avis sur l'annonce 2 (Marrakech riad)
  { _id: new ObjectId(), cibleId: annonceId2, cibleType: "annonce", auteurId: userId4, reservationId: reservId_m6, note: 5, commentaire: "Le riad de mes rêves ! Chaque détail est soigné.", createdAt: new Date("2026-03-05") },
  { _id: new ObjectId(), cibleId: annonceId2, cibleType: "annonce", auteurId: userId3, reservationId: reservId_m6, note: 5, commentaire: "Expérience inoubliable, le hammam est magnifique.", createdAt: new Date("2026-03-08") },
  { _id: new ObjectId(), cibleId: annonceId2, cibleType: "annonce", auteurId: userId5, reservationId: reservId_k1, note: 5, commentaire: "Parfait pour Noël à Marrakech, service impeccable.", createdAt: new Date("2026-03-10") },

  // Avis sur l'annonce 3 (Villa Marrakech)
  { _id: new ObjectId(), cibleId: annonceId3, cibleType: "annonce", auteurId: userId5, reservationId: reservId_g3, note: 5, commentaire: "Villa de rêve, piscine chauffée, accueil parfait.", createdAt: new Date("2026-04-20") },
  { _id: new ObjectId(), cibleId: annonceId3, cibleType: "annonce", auteurId: userId3, reservationId: reservId_g3, note: 4, commentaire: "Superbe villa, quelques petits détails à améliorer.", createdAt: new Date("2026-04-22") },

  // Avis sur l'annonce 4 (Rabat)
  { _id: new ObjectId(), cibleId: annonceId4, cibleType: "annonce", auteurId: userId3, reservationId: reservId_g6, note: 4, commentaire: "Appartement bien situé, propre et fonctionnel.", createdAt: new Date("2026-05-22") },
  { _id: new ObjectId(), cibleId: annonceId4, cibleType: "annonce", auteurId: userId5, reservationId: reservId_g6, note: 5, commentaire: "Parfait pour visiter Rabat, hôte disponible et sympa.", createdAt: new Date("2026-05-25") },

  // Avis sur l'annonce 5 (Fès)
  { _id: new ObjectId(), cibleId: annonceId5, cibleType: "annonce", auteurId: userId4, reservationId: reservId_g2, note: 5, commentaire: "La médina de Fès est magique, cette maison d'hôtes est idéale.", createdAt: new Date("2026-06-10") },
  { _id: new ObjectId(), cibleId: annonceId5, cibleType: "annonce", auteurId: userId3, reservationId: reservId_g2, note: 4, commentaire: "Très belle expérience authentique dans la médina.", createdAt: new Date("2026-06-12") },

  // Avis sur l'annonce 6 (Chambre Marrakech)
  { _id: new ObjectId(), cibleId: annonceId6, cibleType: "annonce", auteurId: userId3, reservationId: reservId_k5, note: 4, commentaire: "Chambre confortable, petit-déjeuner délicieux.", createdAt: new Date("2026-08-07") },
  { _id: new ObjectId(), cibleId: annonceId6, cibleType: "annonce", auteurId: userId4, reservationId: reservId_k5, note: 4, commentaire: "Bon rapport qualité-prix pour Marrakech centre.", createdAt: new Date("2026-08-09") },

  // Avis sur une activité
  { _id: new ObjectId(), cibleId: activiteId1, cibleType: "activite", auteurId: userId3, reservationId: reservId_g2, note: 5, commentaire: "Visite guidée de la médina exceptionnelle, guide très cultivé.", createdAt: new Date("2026-06-15") }
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
    photos: ["https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800", "https://images.unsplash.com/photo-1548013146-72479768bada?w=800"],
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
    photos: ["https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800"],
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
    photos: ["https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800", "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800"],
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
    photos: ["https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800"],
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
    date: new Date("2026-06-09"),
    nbParticipants: 2,
    prixTotal: 300,
    statut: "confirmee"
  },
  {
    _id: new ObjectId(),
    activiteId: activiteId2,
    voyageurId: userId4,
    date: new Date("2026-03-03"),
    nbParticipants: 3,
    prixTotal: 750,
    statut: "confirmee"
  },
  {
    _id: new ObjectId(),
    activiteId: activiteId3,
    voyageurId: userId5,
    date: new Date("2026-04-14"),
    nbParticipants: 4,
    prixTotal: 1600,
    statut: "confirmee"
  },
  {
    _id: new ObjectId(),
    activiteId: activiteId4,
    voyageurId: userId3,
    date: new Date("2026-09-22"),
    nbParticipants: 2,
    prixTotal: 400,
    statut: "en_attente"
  },
  {
    _id: new ObjectId(),
    activiteId: activiteId1,
    voyageurId: userId5,
    date: new Date("2026-10-08"),
    nbParticipants: 2,
    prixTotal: 300,
    statut: "annulee"
  },
  {
    _id: new ObjectId(),
    activiteId: activiteId2,
    voyageurId: userId3,
    date: new Date("2026-12-22"),
    nbParticipants: 2,
    prixTotal: 500,
    statut: "en_attente"
  }
]);
print("✓ 6 réservations d'activités insérées");

print("\n═══════════════════════════════════════════════════════");
print("✓ Toutes les données de test insérées avec succès !");
print("═══════════════════════════════════════════════════════");
