// ============================================================
// ÉTAPE 4 — Requêtes Cypher de recommandation
// ============================================================

// ─── 1. Recommander logements selon préférences d'un voyageur ─
// Score = somme des poids pour chaque caractéristique commune
// Exclure les logements déjà séjournés
// ──────────────────────────────────────────────────────────────
// Pour le voyageur Mehdi (userId = 665f000000000000000000a3)

MATCH (v:Voyageur { userId: '665f000000000000000000a3' })-[p:PREFERE]->(c:Caracteristique)
MATCH (l:Logement)-[:POSSEDE]->(c)
WHERE NOT (v)-[:A_SEJOURNE]->(l)
  AND l.prixParNuit <= v.budget
WITH l, sum(p.poids) AS score, collect(c.nom) AS caracteristiquesCommunes
ORDER BY score DESC
RETURN
  l.annonceId           AS logementId,
  l.ville               AS ville,
  l.prixParNuit         AS prixParNuit,
  score                 AS scoreCompatibilite,
  caracteristiquesCommunes
LIMIT 5;

// ─── 2. Logements similaires (≥ 2 caractéristiques communes) ──
// Utile pour la section "Logements similaires" sur la page détail

MATCH (l1:Logement { annonceId: '665f000000000000000000b2' })-[:POSSEDE]->(c:Caracteristique)
MATCH (l2:Logement)-[:POSSEDE]->(c)
WHERE l1 <> l2
WITH l2, collect(c.nom) AS communes, count(c) AS nbCommunes
WHERE nbCommunes >= 2
ORDER BY nbCommunes DESC
RETURN
  l2.annonceId  AS logementSimilaire,
  l2.ville      AS ville,
  nbCommunes    AS caracteristiquesCommunes,
  communes;

// ─── 3. Caractéristiques manquantes pour un voyageur ──────────
// Quelles préférences du voyageur le logement ne couvre PAS ?

MATCH (v:Voyageur { userId: '665f000000000000000000a4' })-[:PREFERE]->(c:Caracteristique)
WHERE NOT EXISTS {
  MATCH (l:Logement { annonceId: '665f000000000000000000b4' })-[:POSSEDE]->(c)
}
RETURN c.nom AS caracteristiqueManquante
ORDER BY c.nom;

// ─── 4. Top 5 logements recommandés pour un voyageur ──────────
// Version pondérée + filtre budget + tri multi-critères

MATCH (v:Voyageur { userId: '665f000000000000000000a5' })-[p:PREFERE]->(c:Caracteristique)
MATCH (l:Logement)-[:POSSEDE]->(c)
WHERE l.prixParNuit <= v.budget
WITH
  v, l,
  sum(p.poids) AS score,
  collect(c.nom) AS communes,
  count(c) AS nbCommunes
ORDER BY score DESC, nbCommunes DESC
WITH v, l, score, communes, nbCommunes
LIMIT 5
OPTIONAL MATCH (v)-[s:A_SEJOURNE]->(l)
RETURN
  l.annonceId     AS logementId,
  l.ville         AS ville,
  l.prixParNuit   AS prixParNuit,
  score           AS scoreTotal,
  nbCommunes      AS nbCaracteristiquesCommunes,
  communes        AS caracteristiques,
  s.note          AS noteVoyageur;

// ─── 5. Voyageurs ayant des préférences similaires ────────────
// Filtrer les voyageurs qui partagent ≥ 3 préférences avec Mehdi

MATCH (v1:Voyageur { userId: '665f000000000000000000a3' })-[:PREFERE]->(c:Caracteristique)
MATCH (v2:Voyageur)-[:PREFERE]->(c)
WHERE v1 <> v2
WITH v2, collect(c.nom) AS prefsCommunes, count(c) AS nbCommunes
WHERE nbCommunes >= 2
RETURN
  v2.nom          AS voyageurSimilaire,
  v2.ville        AS ville,
  nbCommunes      AS preferencesCommunes,
  prefsCommunes   AS details
ORDER BY nbCommunes DESC;

// ─── 6. Logements non encore découverts — filtrage collaboratif ─
// Logements séjournés positivement par des voyageurs similaires
// mais pas encore par notre voyageur

MATCH (v1:Voyageur { userId: '665f000000000000000000a3' })-[:PREFERE]->(c:Caracteristique)
      <-[:PREFERE]-(v2:Voyageur)
WHERE v1 <> v2
WITH v1, v2, count(c) AS prefsCommunes
WHERE prefsCommunes >= 2
MATCH (v2)-[s:A_SEJOURNE]->(l:Logement)
WHERE s.note >= 4
  AND NOT (v1)-[:A_SEJOURNE]->(l)
  AND l.prixParNuit <= v1.budget
RETURN DISTINCT
  l.annonceId   AS logementId,
  l.ville       AS ville,
  l.prixParNuit AS prixParNuit,
  s.note        AS noteVoyageurSimilaire,
  v2.nom        AS recommandePar
ORDER BY s.note DESC;

// ─── 7. Graphe global — vérification ──────────────────────────
MATCH (v:Voyageur)-[r]->(n)
RETURN v.nom, type(r), labels(n), n.nom, n.annonceId LIMIT 30;
