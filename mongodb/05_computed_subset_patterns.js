// ============================================================
// ÉTAPE 1 — Computed Pattern + Subset Pattern
// ============================================================

use("airbnb_clone");

print("═══════════════════════════════════════════════════════");
print("   COMPUTED PATTERN + SUBSET PATTERN — Airbnb Clone");
print("═══════════════════════════════════════════════════════\n");

// ─── Désactiver temporairement la validation stricte ────────
["annonces", "activites", "users"].forEach(col =>
  db.runCommand({ collMod: col, validationLevel: "off" })
);

// ════════════════════════════════════════════════════════════
// COMPUTED PATTERN : noteMoyenne + nbAvis + topAvis
// ════════════════════════════════════════════════════════════

function updateComputedPatternAnnonce(annonceId) {
  const result = db.avis.aggregate([
    { $match: { cibleId: annonceId, cibleType: "annonce" } },
    {
      $group: {
        _id: "$cibleId",
        noteMoyenne: { $avg: "$note" },
        nbAvis:      { $sum: 1 }
      }
    }
  ]).toArray();

  if (result.length === 0) {
    db.annonces.updateOne(
      { _id: annonceId },
      { $set: { noteMoyenne: 0.0, nbAvis: NumberInt(0), topAvis: [] } }
    );
    return;
  }

  const noteMoyenne = result[0].noteMoyenne;
  const nbAvis      = result[0].nbAvis;

  // Subset Pattern : top 3 avis (meilleure note, puis plus récent)
  const top3 = db.avis.aggregate([
    { $match: { cibleId: annonceId, cibleType: "annonce" } },
    { $sort: { note: -1, createdAt: -1 } },
    { $limit: 3 },
    {
      $lookup: {
        from: "users",
        localField: "auteurId",
        foreignField: "_id",
        as: "auteur"
      }
    },
    { $unwind: { path: "$auteur", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        auteurId:    "$auteurId",
        auteurNom:   { $ifNull: ["$auteur.name", "Anonyme"] },
        note:        { $toInt: "$note" },
        commentaire: 1,
        createdAt:   1,
        _id: 0
      }
    }
  ]).toArray();

  const arrondie = Math.round(noteMoyenne * 10) / 10;

  db.annonces.updateOne(
    { _id: annonceId },
    {
      $set: {
        noteMoyenne: arrondie,
        nbAvis:      NumberInt(nbAvis),
        topAvis:     top3
      }
    }
  );
}

// ─── Recalcul pour toutes les annonces ──────────────────────
print("── Recalcul noteMoyenne + nbAvis pour toutes les annonces ─");
const toutesAnnonces = db.annonces.find({}, { _id: 1 }).toArray();
toutesAnnonces.forEach(a => {
  updateComputedPatternAnnonce(a._id);
});
print(`✓ ${toutesAnnonces.length} annonces mises à jour (noteMoyenne, nbAvis, topAvis)`);

// ─── Vérification ───────────────────────────────────────────
print("\n── Résultats après mise à jour ─────────────────────────");
printjson(db.annonces.find(
  {},
  { titre: 1, noteMoyenne: 1, nbAvis: 1, "topAvis.auteurNom": 1, "topAvis.note": 1 }
).toArray());

// ─── Computed Pattern : avgRating des hôtes ──────────────────
print("\n── Recalcul avgRating pour les hôtes ───────────────────");

function updateAvgRatingHote(hoteId) {
  const res = db.annonces.aggregate([
    { $match: { hoteId: hoteId, nbAvis: { $gt: 0 } } },
    { $group: { _id: "$hoteId", avgRating: { $avg: "$noteMoyenne" } } }
  ]).toArray();

  if (res.length > 0) {
    const avg = Math.round(res[0].avgRating * 10) / 10;
    db.users.updateOne({ _id: hoteId }, { $set: { avgRating: avg } });
    print(`  Hôte ${hoteId}: avgRating = ${avg}`);
  }
}

const hotes = db.users.find({ role: "hote" }, { _id: 1 }).toArray();
hotes.forEach(h => updateAvgRatingHote(h._id));
print(`✓ ${hotes.length} hôtes mis à jour (avgRating)`);

print("\n── Hôtes après mise à jour avgRating ───────────────────");
printjson(db.users.find({ role: "hote" }, { name: 1, avgRating: 1 }).toArray());

// ─── Computed Pattern : activites ───────────────────────────
print("\n── Recalcul noteMoyenne pour les activités ──────────────");
const toutesActivites = db.activites.find({}, { _id: 1 }).toArray();
toutesActivites.forEach(act => {
  const res = db.avis.aggregate([
    { $match: { cibleId: act._id, cibleType: "activite" } },
    { $group: { _id: "$cibleId", noteMoyenne: { $avg: "$note" }, nbAvis: { $sum: 1 } } }
  ]).toArray();

  if (res.length > 0) {
    db.activites.updateOne(
      { _id: act._id },
      { $set: { noteMoyenne: Math.round(res[0].noteMoyenne * 10) / 10 } }
    );
  }
});
print(`✓ ${toutesActivites.length} activités mises à jour (noteMoyenne)`);

// ─── Simulation : ajout d'un avis + déclenchement pattern ────
print("\n── Simulation : ajout d'un nouvel avis ──────────────────");
const annonceTest = new ObjectId("665f000000000000000000b7");

db.avis.insertOne({
  cibleId:       annonceTest,
  cibleType:     "annonce",
  auteurId:      new ObjectId("665f000000000000000000a4"),
  reservationId: new ObjectId("665f000000000000000000c8"),
  note:          NumberInt(5),
  commentaire:   "Studio parfait, terrasse magnifique et emplacement idéal !",
  createdAt:     new Date()
});

print("  → Déclenchement du Computed + Subset Pattern...");
updateComputedPatternAnnonce(annonceTest);

print("  Annonce après mise à jour :");
printjson(db.annonces.findOne(
  { _id: annonceTest },
  { titre: 1, noteMoyenne: 1, nbAvis: 1, topAvis: 1 }
));

// ─── Réactiver la validation ──────────────────────────────────
["annonces", "activites", "users"].forEach(col =>
  db.runCommand({ collMod: col, validationLevel: "moderate" })
);

print("\n✓ Computed Pattern + Subset Pattern exécutés avec succès");
