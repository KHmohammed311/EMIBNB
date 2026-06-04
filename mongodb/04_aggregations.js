// ============================================================
// ÉTAPE 1 — Agrégations MongoDB
// Exécuter dans mongosh : load("04_aggregations.js")
// ============================================================

use("airbnb_clone");

print("═══════════════════════════════════════════════════════");
print("         AGRÉGATIONS — Airbnb Clone");
print("═══════════════════════════════════════════════════════\n");

// ─── 1. Prix moyen des annonces par ville ────────────────────
print("── 1. Prix moyen par ville ──────────────────────────────");
printjson(db.annonces.aggregate([
  {
    $group: {
      _id: "$localisation.ville",
      prixMoyen: { $avg: "$prixParNuit" },
      nbAnnonces: { $sum: 1 },
      prixMin: { $min: "$prixParNuit" },
      prixMax: { $max: "$prixParNuit" }
    }
  },
  { $sort: { prixMoyen: -1 } },
  {
    $project: {
      ville: "$_id",
      prixMoyen: { $round: ["$prixMoyen", 2] },
      nbAnnonces: 1,
      prixMin: 1,
      prixMax: 1,
      _id: 0
    }
  }
]).toArray());

// ─── 2. Top 5 annonces les mieux notées ─────────────────────
print("\n── 2. Top 5 annonces les mieux notées ──────────────────");
printjson(db.annonces.aggregate([
  { $match: { nbAvis: { $gt: 0 } } },
  { $sort: { noteMoyenne: -1, nbAvis: -1 } },
  { $limit: 5 },
  {
    $project: {
      titre: 1,
      ville: "$localisation.ville",
      type: 1,
      prixParNuit: 1,
      noteMoyenne: 1,
      nbAvis: 1
    }
  }
]).toArray());

// ─── 3. Nombre de réservations par statut ───────────────────
print("\n── 3. Réservations par statut ──────────────────────────");
printjson(db.reservations.aggregate([
  {
    $group: {
      _id: "$statut",
      total: { $sum: 1 },
      revenuTotal: { $sum: "$prixTotal" }
    }
  },
  { $sort: { total: -1 } },
  {
    $project: {
      statut: "$_id",
      total: 1,
      revenuTotal: 1,
      _id: 0
    }
  }
]).toArray());

// ─── 4. Annonces disponibles entre deux dates ────────────────
print("\n── 4. Annonces disponibles du 2026-11-01 au 2026-11-10 ─");
const dateArrivee = new Date("2026-11-01");
const dateDepart  = new Date("2026-11-10");

// Trouver les annonceIds déjà réservées sur ces dates
const annoncesBloqueesIds = db.reservations.distinct("annonceId", {
  statut: { $in: ["confirmee", "en_attente"] },
  $and: [
    { dateArrivee: { $lt: dateDepart } },
    { dateDepart:  { $gt: dateArrivee } }
  ]
});

printjson(db.annonces.aggregate([
  {
    $match: {
      _id: { $nin: annoncesBloqueesIds }
    }
  },
  {
    $project: {
      titre: 1,
      ville: "$localisation.ville",
      type: 1,
      prixParNuit: 1,
      maxVoyageurs: 1
    }
  }
]).toArray());

// ─── 5. Auteurs avec le plus d'avis ─────────────────────────
print("\n── 5. Auteurs les plus actifs (par nb d'avis) ──────────");
printjson(db.avis.aggregate([
  {
    $group: {
      _id: "$auteurId",
      nbAvisEcrits: { $sum: 1 },
      noteMoyenneDonnee: { $avg: "$note" }
    }
  },
  { $sort: { nbAvisEcrits: -1 } },
  {
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "_id",
      as: "auteur"
    }
  },
  { $unwind: "$auteur" },
  {
    $project: {
      nomAuteur: "$auteur.name",
      nbAvisEcrits: 1,
      noteMoyenneDonnee: { $round: ["$noteMoyenneDonnee", 2] },
      _id: 0
    }
  }
]).toArray());

// ─── 6. Distribution des notes ──────────────────────────────
print("\n── 6. Distribution des notes (1 à 5) ───────────────────");
printjson(db.avis.aggregate([
  {
    $group: {
      _id: "$note",
      nombre: { $sum: 1 },
      pourcentage: { $sum: 1 }
    }
  },
  { $sort: { _id: -1 } },
  {
    $project: {
      note: "$_id",
      nombre: 1,
      _id: 0
    }
  }
]).toArray());

// ─── 7. Jointure annonces + avis ($lookup) ──────────────────
print("\n── 7. Annonces avec leurs avis ($lookup) ───────────────");
printjson(db.annonces.aggregate([
  { $limit: 3 },
  {
    $lookup: {
      from: "avis",
      let: { annonceIdVar: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$cibleId", "$$annonceIdVar"] },
                { $eq: ["$cibleType", "annonce"] }
              ]
            }
          }
        },
        { $sort: { note: -1 } },
        { $limit: 5 },
        { $project: { note: 1, commentaire: 1, auteurId: 1, createdAt: 1, _id: 0 } }
      ],
      as: "avisDetails"
    }
  },
  {
    $project: {
      titre: 1,
      ville: "$localisation.ville",
      noteMoyenne: 1,
      nbAvis: 1,
      nbAvisCharges: { $size: "$avisDetails" },
      avisDetails: 1
    }
  }
]).toArray());

// ─── 8. Revenus par hôte ────────────────────────────────────
print("\n── 8. Revenus totaux par hôte ──────────────────────────");
printjson(db.reservations.aggregate([
  { $match: { statut: { $in: ["confirmee", "terminee"] } } },
  {
    $lookup: {
      from: "annonces",
      localField: "annonceId",
      foreignField: "_id",
      as: "annonce"
    }
  },
  { $unwind: "$annonce" },
  {
    $group: {
      _id: "$annonce.hoteId",
      revenuTotal: { $sum: "$prixTotal" },
      nbReservations: { $sum: 1 }
    }
  },
  {
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "_id",
      as: "hote"
    }
  },
  { $unwind: "$hote" },
  {
    $project: {
      nomHote: "$hote.name",
      revenuTotal: 1,
      nbReservations: 1,
      _id: 0
    }
  },
  { $sort: { revenuTotal: -1 } }
]).toArray());

// ─── 9. Taux d'occupation par annonce ───────────────────────
print("\n── 9. Annonces avec le plus de réservations confirmées ─");
printjson(db.reservations.aggregate([
  { $match: { statut: { $in: ["confirmee", "terminee"] } } },
  {
    $group: {
      _id: "$annonceId",
      nbReservations: { $sum: 1 },
      revenuTotal: { $sum: "$prixTotal" },
      nbNuitees: {
        $sum: {
          $divide: [
            { $subtract: ["$dateDepart", "$dateArrivee"] },
            1000 * 60 * 60 * 24
          ]
        }
      }
    }
  },
  {
    $lookup: {
      from: "annonces",
      localField: "_id",
      foreignField: "_id",
      as: "annonce"
    }
  },
  { $unwind: "$annonce" },
  {
    $project: {
      titre: "$annonce.titre",
      ville: "$annonce.localisation.ville",
      nbReservations: 1,
      revenuTotal: 1,
      nbNuitees: { $round: ["$nbNuitees", 0] },
      _id: 0
    }
  },
  { $sort: { nbReservations: -1 } }
]).toArray());

print("\n✓ Toutes les agrégations exécutées avec succès");
