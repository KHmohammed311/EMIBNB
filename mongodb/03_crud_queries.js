// ============================================================
// ÉTAPE 1 — Requêtes CRUD complètes
// Exécuter dans mongosh : load("03_crud_queries.js")
// ============================================================

use("airbnb_clone");

print("═══════════════════════════════════════════════════════");
print("           REQUÊTES CRUD — Airbnb Clone");
print("═══════════════════════════════════════════════════════\n");

// ════════════════════════════════════════════════════════════
//  FIND — Requêtes de lecture avec filtres
// ════════════════════════════════════════════════════════════

print("── 1. Toutes les annonces ──────────────────────────────");
printjson(db.annonces.find({}, { titre: 1, "localisation.ville": 1, prixParNuit: 1, type: 1 }).toArray());

print("\n── 2. Annonces à Marrakech ─────────────────────────────");
printjson(db.annonces.find(
  { "localisation.ville": "Marrakech" },
  { titre: 1, type: 1, prixParNuit: 1 }
).toArray());

print("\n── 3. Annonces par type : villa ────────────────────────");
printjson(db.annonces.find(
  { type: "villa" },
  { titre: 1, "localisation.ville": 1, prixParNuit: 1 }
).toArray());

print("\n── 4. Annonces avec prix entre 200 et 500 MAD/nuit ────");
printjson(db.annonces.find(
  { prixParNuit: { $gte: 200, $lte: 500 } },
  { titre: 1, prixParNuit: 1, "localisation.ville": 1 }
).sort({ prixParNuit: 1 }).toArray());

print("\n── 5. Annonces avec note ≥ 4.7, triées par note ───────");
printjson(db.annonces.find(
  { noteMoyenne: { $gte: 4.7 } },
  { titre: 1, noteMoyenne: 1, "localisation.ville": 1 }
).sort({ noteMoyenne: -1 }).toArray());

print("\n── 6. Annonces pour ≥ 6 voyageurs ─────────────────────");
printjson(db.annonces.find(
  { maxVoyageurs: { $gte: 6 } },
  { titre: 1, maxVoyageurs: 1, "localisation.ville": 1 }
).toArray());

print("\n── 7. Annonces avec piscine et parking ─────────────────");
printjson(db.annonces.find(
  { "caracteristiques.piscine": true, "caracteristiques.parking": true },
  { titre: 1, "localisation.ville": 1, prixParNuit: 1 }
).toArray());

print("\n── 8. Annonces avec politique d'annulation flexible ────");
printjson(db.annonces.find(
  { "politiqueAnnulation.type": "flexible" },
  { titre: 1, "politiqueAnnulation": 1 }
).toArray());

print("\n── 9. Toutes les réservations terminées ────────────────");
printjson(db.reservations.find(
  { statut: "terminee" },
  { annonceId: 1, voyageurId: 1, dateArrivee: 1, dateDepart: 1, prixTotal: 1 }
).toArray());

print("\n── 10. Avis de note 5 étoiles ──────────────────────────");
printjson(db.avis.find(
  { note: 5, cibleType: "annonce" },
  { cibleId: 1, auteurId: 1, commentaire: 1 }
).toArray());

print("\n── 11. Utilisateur par email ────────────────────────────");
printjson(db.users.findOne({ email: "youssef@airbnb-clone.ma" }));

print("\n── 12. Activités à Marrakech dans la catégorie Gastronomie ─");
printjson(db.activites.find(
  { ville: "Marrakech", categorie: "Gastronomie" }
).toArray());

// ════════════════════════════════════════════════════════════
//  UPDATE — Mise à jour de documents
// ════════════════════════════════════════════════════════════

print("\n═══════════════════════════════════════════════════════");
print("                   UPDATE");
print("═══════════════════════════════════════════════════════\n");

print("── 13. updateOne : Modifier le prix d'une annonce ──────");
let r1 = db.annonces.updateOne(
  { _id: new ObjectId("665f000000000000000000b7") },
  { $set: { prixParNuit: 300 } }
);
print(`Modifié : ${r1.modifiedCount} annonce(s)`);

print("\n── 14. updateOne : Changer statut d'une réservation ────");
let r2 = db.reservations.updateOne(
  { _id: new ObjectId("665f000000000000000000c9") },
  { $set: { statut: "confirmee" } }
);
print(`Modifié : ${r2.modifiedCount} réservation(s)`);

print("\n── 15. updateMany : Ajouter 'Espace de travail' aux appartements de Casablanca ─");
let r3 = db.annonces.updateMany(
  { "localisation.ville": "Casablanca", type: "appartement" },
  { $addToSet: { equipements: "Espace de travail" } }
);
print(`Modifié : ${r3.modifiedCount} annonce(s)`);

print("\n── 16. updateOne : Mettre à jour les infos de l'hôte ──");
let r4 = db.users.updateOne(
  { email: "fatima@airbnb-clone.ma" },
  {
    $set: { "languages": ["Arabe", "Français", "Anglais", "Espagnol"] },
    $currentDate: { lastModified: true }
  }
);
print(`Modifié : ${r4.modifiedCount} utilisateur(s)`);

print("\n── 17. updateOne : Activer le WiFi sur une annonce ─────");
let r5 = db.annonces.updateOne(
  { _id: new ObjectId("665f000000000000000000b5") },
  { $set: { "caracteristiques.wifi": true } }
);
print(`Modifié : ${r5.modifiedCount} annonce(s)`);

// ════════════════════════════════════════════════════════════
//  DELETE — Suppression de documents
// ════════════════════════════════════════════════════════════

print("\n═══════════════════════════════════════════════════════");
print("                   DELETE");
print("═══════════════════════════════════════════════════════\n");

print("── 18. deleteOne : Supprimer une réservation annulée ───");
let annonceIdTemp = new ObjectId("665f000000000000000000b1");
let voyageurIdTemp = new ObjectId("665f000000000000000000a5");

// Insérer une réservation de test à supprimer
db.reservations.insertOne({
  annonceId: annonceIdTemp,
  voyageurId: voyageurIdTemp,
  dateArrivee: new Date("2020-01-01"),
  dateDepart: new Date("2020-01-02"),
  prixTotal: 450,
  statut: "annulee",
  nbVoyageurs: 1,
  fraisAnnulation: 0,
  createdAt: new Date("2020-01-01")
});
let r6 = db.reservations.deleteOne({
  statut: "annulee",
  dateDepart: { $lt: new Date("2021-01-01") }
});
print(`Supprimé : ${r6.deletedCount} réservation(s) (test)`);

print("\n── 19. deleteMany : Supprimer les avis anciens de test ─");
// Insérer un avis de test à supprimer
db.avis.insertOne({
  cibleId: annonceIdTemp,
  cibleType: "annonce",
  auteurId: voyageurIdTemp,
  reservationId: new ObjectId(),
  note: 1,
  commentaire: "Avis de test à supprimer",
  createdAt: new Date("2019-01-01")
});
let r7 = db.avis.deleteMany({
  createdAt: { $lt: new Date("2020-01-01") }
});
print(`Supprimé : ${r7.deletedCount} avis de test`);

print("\n✓ Toutes les opérations CRUD exécutées avec succès");
