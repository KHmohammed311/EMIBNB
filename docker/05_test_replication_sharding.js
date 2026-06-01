// ============================================================
// ÉTAPE 5 — Commandes de test : Réplication & Sharding
// Exécuter dans mongosh connecté au PRIMARY ou au MONGOS
// ============================================================

// ════════════════════════════════════════════════════════════
// A. TESTS REPLICA SET
// Se connecter : mongosh mongodb://localhost:27017
// ════════════════════════════════════════════════════════════

print("═══════════════════════════════════════════════════════");
print("         TEST REPLICA SET — rs0");
print("═══════════════════════════════════════════════════════\n");

// ─── 1. Statut complet du replica set ───────────────────────
print("── 1. rs.status() ──────────────────────────────────────");
printjson(rs.status());

// ─── 2. Configuration du replica set ─────────────────────────
print("\n── 2. rs.conf() ─────────────────────────────────────────");
printjson(rs.conf());

// ─── 3. Identifier le membre primaire ────────────────────────
print("\n── 3. Nœud primaire actuel ──────────────────────────────");
printjson(rs.isMaster());

// ─── 4. Insérer un document sur le primaire ──────────────────
print("\n── 4. Insertion d'un document test ─────────────────────");
use("airbnb_clone");
db.replication_test.insertOne({
  message: "Test de réplication",
  timestamp: new Date(),
  noeud: "primary"
});
print("Document inséré sur le PRIMARY");
print("→ Vérifier sur secondary1 (port 27018) :");
print("  mongosh --port 27018 --eval \"rs.secondaryOk(); db.replication_test.find()\"");

// ─── 5. Test de lecture sur secondaire ───────────────────────
print("\n── 5. Lecture depuis un secondaire ─────────────────────");
print("  Exécuter sur le secondaire :");
print("  rs.secondaryOk();");
print("  db.replication_test.find().toArray();");

// ─── 6. Simuler un failover (ATTENTION : arrête le primaire) ─
print("\n── 6. Test de failover automatique ─────────────────────");
print("  Pour simuler un failover :");
print("  1. Stopper le container primaire :");
print("     docker stop mongo-primary");
print("  2. Vérifier l'élection du nouveau primaire :");
print("     mongosh --port 27018 --eval \"rs.status()\"");
print("  3. Redémarrer l'ancien primaire (devient secondaire) :");
print("     docker start mongo-primary");
print("  4. Vérifier que la réplication reprend :");
print("     mongosh --port 27017 --eval \"rs.status()\"");

// ─── 7. Statistiques de réplication ──────────────────────────
print("\n── 7. Lag de réplication ────────────────────────────────");
printjson(rs.printReplicationInfo());
printjson(rs.printSecondaryReplicationInfo());

// ════════════════════════════════════════════════════════════
// B. TESTS CLUSTER SHARDÉ
// Se connecter au MONGOS : mongosh mongodb://localhost:27017
// ════════════════════════════════════════════════════════════

print("\n═══════════════════════════════════════════════════════");
print("         TEST CLUSTER SHARDÉ");
print("═══════════════════════════════════════════════════════\n");

use("airbnb_clone");

// ─── 8. Statut du cluster shardé ─────────────────────────────
print("── 8. sh.status() ──────────────────────────────────────");
printjson(sh.status());

// ─── 9. Distribution des données par shard ───────────────────
print("\n── 9. Distribution des annonces par shard ───────────────");
db.annonces.getShardDistribution();

// ─── 10. Statistiques des collections ────────────────────────
print("\n── 10. Infos sur la collection annonces ────────────────");
printjson(db.annonces.stats());

// ─── 11. Vérifier que le sharding est actif ──────────────────
print("\n── 11. Collections shardées dans airbnb_clone ──────────");
printjson(db.getSiblingDB("config").collections.find(
  { _id: /^airbnb_clone/ }
).toArray());

// ─── 12. Insérer des données de test pour tester le sharding ─
print("\n── 12. Insertion de documents de test (villes variées) ──");
const villesTest = [
  "Casablanca", "Marrakech", "Rabat", "Fès", "Tanger",
  "Agadir", "Oujda", "Tétouan", "Meknès", "El Jadida"
];

const hoteId = new ObjectId("665f000000000000000000a1");
const docs = villesTest.flatMap((ville, i) =>
  Array.from({ length: 3 }, (_, j) => ({
    titre: `Annonce test ${ville} ${j+1}`,
    description: `Description test pour ${ville}`,
    hoteId: hoteId,
    type: ["appartement", "maison", "villa", "chambre"][j % 4],
    prixParNuit: 100 + (i * 50) + (j * 20),
    maxVoyageurs: 2 + j,
    localisation: { ville, pays: "Maroc", coordonnees: [-5.0 + i * 0.5, 33.0 + j * 0.3] },
    noteMoyenne: 0,
    nbAvis: 0
  }))
);

db.annonces.insertMany(docs);
print(`${docs.length} annonces de test insérées`);

// ─── 13. Vérifier la distribution après insertion ────────────
print("\n── 13. Nouvelle distribution après insertion ────────────");
db.annonces.getShardDistribution();

// ─── 14. Requête ciblée sur un shard (shard pruning) ─────────
print("\n── 14. Requête avec explain (shard pruning sur Marrakech) ─");
printjson(
  db.annonces.find({ "localisation.ville": "Marrakech" })
             .explain("executionStats")
);

// ─── 15. Nettoyage des données de test ───────────────────────
print("\n── 15. Nettoyage des données de test ────────────────────");
const result = db.annonces.deleteMany({ titre: /^Annonce test/ });
print(`Supprimé : ${result.deletedCount} documents de test`);

print("\n✓ Tests de réplication et sharding terminés");
print("═══════════════════════════════════════════════════════");
